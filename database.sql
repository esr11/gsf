-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS gsf_db;
USE gsf_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'government_admin', 'system_admin') NOT NULL DEFAULT 'user',
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    last_login DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME
);

-- System logs table
CREATE TABLE IF NOT EXISTS system_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    action VARCHAR(255) NOT NULL,
    user_id INT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert default system admin user
INSERT INTO users (username, email, password, role, status, created_at)
VALUES (
    'system.admin',
    'admin@addisababa.gov.et',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- hashed 'password'
    'system_admin',
    'active',
    NOW()
); 