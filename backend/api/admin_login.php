<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

// Allow frontend calls
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database credentials -- put correct info here!
$host = " ";
$user = " ";
$pass = " ";
$dbname = " ";

// Connect to database
$mysqli = new mysqli($host, $user, $pass, $dbname);
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to connect to database"]);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// Read JSON body
$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

// Basic validation
if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Missing username or password"]);
    exit;
}

// Find admin user
$stmt = $mysqli->prepare("SELECT id, password_hash FROM admins WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

// Check credentials
if ($row = $result->fetch_assoc()) {
    if (password_verify($password, $row['password_hash'])) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_id'] = $row['id'];
        echo json_encode(["success" => true]);
        exit;
    }
}

// Invalid login
http_response_code(401);
echo json_encode(["error" => "Invalid username or password"]);

$stmt->close();
$mysqli->close();
