<?php

// example use from browser
// http://localhost/companydirectory/libs/php/deletePersonnelByID.php?id=<id>

// remove the next two lines in production

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

try {

	$query = $conn->prepare('DELETE FROM `personnel` WHERE `id` = ?');

} catch (mysqli_sql_exception $e) {

	$output['status']['code'] = "400";
	$output['status']['name'] = "SQL statement failed.";
	$output['status']['description'] = $e->getMessage();
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	echo json_encode($output);

	exit;
}

// use $_POST in production

$query->bind_param("i", $_REQUEST['id']);
$query->execute();

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

echo json_encode($output);

mysqli_close($conn);

?>
