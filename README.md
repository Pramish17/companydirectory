# Company Directory

A full-stack company directory web application built with Bootstrap 5, jQuery, PHP 8+, and MySQL/MariaDB.

## Prerequisites

- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL + PHP) installed and running

## Setup Steps

### 1. Place the project

Ensure the project folder is at:

```
C:\xampp\htdocs\companydirectory\
```

### 2. Import the database

1. Open your browser and go to `http://localhost/phpmyadmin`
2. Click **New** in the left sidebar and create a database named `companydirectory`
3. Select the `companydirectory` database
4. Click the **Import** tab
5. Click **Choose File** and select `libs/sql/companydirectory.sql`
6. Click **Go**

### 3. Create the database user

In phpMyAdmin, run the following SQL (adjust the password as needed):

```sql
CREATE USER 'companydirectoryUser'@'localhost' IDENTIFIED BY 'companydirectoryUser@2022';
GRANT ALL PRIVILEGES ON companydirectory.* TO 'companydirectoryUser'@'localhost';
FLUSH PRIVILEGES;
```

### 4. Configure the database connection

Copy or create `libs/php/config.php` (this file is excluded from git):

```php
<?php
    $cd_host     = "127.0.0.1";
    $cd_port     = 3306;
    $cd_socket   = "";
    $cd_dbname   = "companydirectory";
    $cd_user     = "companydirectoryUser";
    $cd_password = "companydirectoryUser@2022";
?>
```

Update the values to match your local MySQL credentials if they differ.

### 5. Start XAMPP

Open the XAMPP Control Panel and start **Apache** and **MySQL**.

### 6. Open the application

Navigate to:

```
http://localhost/companydirectory
```

## Notes

- All PHP endpoints use `$_REQUEST` for development convenience. Change to `$_POST` before deploying to production.
- `libs/php/config.php` is excluded from version control via `.gitignore` — never commit database credentials.
