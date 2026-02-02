<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
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

// DELETE a score
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing id"]);
        exit;
    }
    $id = intval($_GET['id']);
    $stmt = $mysqli->prepare("DELETE FROM scores WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to delete"]);
    }
    $stmt->close();
    $mysqli->close();
    exit;
}

// POST update a score
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($_GET['id'], $data['name'], $data['points'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields"]);
        exit;
    }
    $id = intval($_GET['id']);
    $name = $mysqli->real_escape_string($data['name']);
    $points = intval($data['points']);
    
    $stmt = $mysqli->prepare("UPDATE scores SET name = ?, points = ? WHERE id = ?");
    $stmt->bind_param("sii", $name, $points, $id);
    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Failed to update"]);
    }
    $stmt->close();
    $mysqli->close();
    exit;
}

// GET all scores
$result = $mysqli->query("SELECT id, name, email, points FROM scores ORDER BY points DESC");
$scores = [];
while ($row = $result->fetch_assoc()) {
    $scores[] = $row;
}
echo json_encode($scores);
$mysqli->close();
