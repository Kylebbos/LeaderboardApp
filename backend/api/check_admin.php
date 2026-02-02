<?php
session_start();
header("Content-Type: application/json");

if (!empty($_SESSION['admin_logged_in'])) {
  echo json_encode(["loggedIn" => true]);
} else {
  echo json_encode(["loggedIn" => false]);
}
