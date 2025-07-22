<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Get the raw POST data
$data = json_decode(file_get_contents('php://input'), true);

// Check if email and code are provided
if (!isset($data['email']) || !isset($data['code'])) {
    echo json_encode(['success' => false, 'message' => 'Email and verification code are required']);
    exit;
}

$email = $data['email'];
$code = $data['code'];

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "gsf";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if verification code matches
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = :email AND verification_code = :code");
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':code', $code);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        // Update user as verified
        $stmt = $conn->prepare("UPDATE users SET is_verified = 1 WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        echo json_encode(['success' => true, 'message' => 'Email verified successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid verification code']);
    }
    
} catch(PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

$conn = null;
?> 