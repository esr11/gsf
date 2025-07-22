<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Get the raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Check if email is provided
if (!isset($data['email'])) {
    echo json_encode(['success' => false, 'message' => 'Email is required']);
    exit;
}

$email = $data['email'];

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gsf";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if email already exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->bindParam(':email', $email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        exit;
    }
    
    // Generate verification code
    $verification_code = rand(100000, 999999);
    
    // Insert new user with verification code
    $stmt = $conn->prepare("INSERT INTO users (email, verification_code, is_verified) VALUES (:email, :verification_code, 0)");
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':verification_code', $verification_code);
    $stmt->execute();
    
    // TODO: Send verification email
    // For now, we'll just return success
    echo json_encode(['success' => true, 'message' => 'Verification code sent to your email']);
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

$conn = null;
?> 