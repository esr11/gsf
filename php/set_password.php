<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Get the raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Check if email and password are provided
if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit;
}

$email = $data['email'];
$password = $data['password'];

// Hash the password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gsf";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Update user's password
    $stmt = $conn->prepare("UPDATE users SET password = :password WHERE email = :email AND is_verified = 1");
    $stmt->bindParam(':password', $hashed_password);
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Password set successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found or not verified']);
    }
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

$conn = null;
?> 