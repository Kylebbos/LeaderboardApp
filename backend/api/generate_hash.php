<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$password = " ";
$hash = password_hash($password, PASSWORD_DEFAULT);
echo "Password: " . $password . "<br>";
echo "Generated hash: " . $hash . "<br>";