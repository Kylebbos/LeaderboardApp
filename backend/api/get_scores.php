<?php
header("Content-Type: application/json");
$mysqli = new mysqli(" "," "," "," "); // put correct info here!
$result = $mysqli->query("SELECT id,name,points FROM scores ORDER BY points DESC");
$scores = [];
while($row=$result->fetch_assoc()){ $scores[]=$row; }
echo json_encode($scores);
$mysqli->close();
?>
