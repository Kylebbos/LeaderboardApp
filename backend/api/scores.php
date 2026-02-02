<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['name'], $data['email'], $data['points'])) {
  http_response_code(400);
  echo json_encode(["error" => "Missing required fields"]);
  exit;
}

$name = $data['name'];
$email = $data['email'];
$points = intval($data['points']);
$marketingConsent = !empty($data['marketingConsent']) ? 1 : 0;

$mysqli = new mysqli(" "," "," "," "); // put correct info here!
if ($mysqli->connect_errno) { http_response_code(500); echo json_encode(["error"=>"DB error"]); exit; }

$stmt = $mysqli->prepare("INSERT INTO scores (name,email,points,marketingConsent,createdAt) VALUES (?,?,?,?,NOW())");
$stmt->bind_param("ssii",$name,$email,$points,$marketingConsent);
if($stmt->execute()){ echo json_encode(["success"=>true]); } else { http_response_code(500); echo json_encode(["error"=>"Insert failed"]); }
$stmt->close(); $mysqli->close();
?>
