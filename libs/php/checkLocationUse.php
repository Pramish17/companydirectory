<?php

ini_set('display_errors', 'Off');
ini_set('log_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

try {

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

} catch (mysqli_sql_exception $e) {

	$output['status']['code'] = "300";
	$output['status']['name'] = "Database connection failed.";
	$output['status']['description'] = $e->getMessage();
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	echo json_encode($output);

	exit;
}

// SQL statement accepts parameters and so is prepared to avoid SQL injection.
// TODO: change $_REQUEST to $_POST for production

try {

	$query = $conn->prepare(
		'SELECT `l`.`id` AS `locationID`, `l`.`name` AS `locationName`, COUNT(`d`.`id`) AS `departmentCount`
		 FROM `location` `l`
		 LEFT JOIN `department` `d` ON (`d`.`locationID` = `l`.`id`)
		 WHERE `l`.`id` = ?
		 GROUP BY `l`.`id`'
	);

} catch (mysqli_sql_exception $e) {

	$output['status']['code'] = "400";
	$output['status']['name'] = "SQL statement failed.";
	$output['status']['description'] = $e->getMessage();
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	echo json_encode($output);

	exit;

}

$query->bind_param("i", $_REQUEST['id']);
$query->execute();

$result = $query->get_result();

$data = [];

while ($row = mysqli_fetch_assoc($result)) {

	array_push($data, $row);

}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

echo json_encode($output);

mysqli_close($conn);

?>
