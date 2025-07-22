-- Complete Database Setup for Government Service Feedback System
-- This file contains all tables needed to run the application

USE gsf;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chat_sessions;
DROP TABLE IF EXISTS user_activity;
DROP TABLE IF EXISTS user_settings;
DROP TABLE IF EXISTS verification_codes;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS offices;
DROP TABLE IF EXISTS subcities;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('user', 'government_admin', 'system_admin') DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create subcities table
CREATE TABLE subcities (
    subcity_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create offices table
CREATE TABLE offices (
    office_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subcity_id INT,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subcity_id) REFERENCES subcities(subcity_id) ON DELETE SET NULL
);

-- Create employees table
CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    office_id INT,
    position VARCHAR(255),
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (office_id) REFERENCES offices(office_id) ON DELETE SET NULL
);

-- Create feedback table
CREATE TABLE feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    office_id INT,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    status ENUM('pending', 'in_progress', 'resolved', 'closed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (office_id) REFERENCES offices(office_id) ON DELETE SET NULL
);

-- Create verification_codes table
CREATE TABLE verification_codes (
    code_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    code VARCHAR(10) NOT NULL,
    type ENUM('email_verification', 'password_reset') NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create user_settings table
CREATE TABLE user_settings (
    setting_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_setting (user_id, setting_key)
);

-- Create user_activity table
CREATE TABLE user_activity (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create chat_sessions table
CREATE TABLE chat_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    admin_id INT NULL,
    status ENUM('active', 'closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Create chat_messages table
CREATE TABLE chat_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    sender_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Insert initial data

-- Insert default subcities
INSERT INTO subcities (name, description) VALUES
('Addis Ketema', 'Central business district of Addis Ababa'),
('Arada', 'Historic district with cultural significance'),
('Bole', 'International airport area and diplomatic district'),
('Kolfe Keranio', 'Residential and commercial area'),
('Lideta', 'Mixed residential and commercial district'),
('Yeka', 'Residential area with government offices'),
('Kirkos', 'Central district with markets and businesses'),
('Akolfe', 'Residential and commercial area'),
('Nifas Silk-Lafto', 'Residential and commercial district'),
('Gulele', 'Residential area with parks and recreation');

-- Insert sample offices
INSERT INTO offices (name, subcity_id, address, phone, email, description) VALUES
('Addis Ababa City Hall', 1, 'Churchill Road, Addis Ketema', '+251-11-123-4567', 'cityhall@addisababa.gov.et', 'Main administrative office for Addis Ababa city'),
('Bole District Office', 3, 'Bole Road, Bole', '+251-11-234-5678', 'bole@addisababa.gov.et', 'District administration office for Bole area'),
('Yeka Municipal Office', 6, 'Yeka Road, Yeka', '+251-11-345-6789', 'yeka@addisababa.gov.et', 'Municipal services office for Yeka district'),
('Kirkos Service Center', 7, 'Kirkos Main Street', '+251-11-456-7890', 'kirkos@addisababa.gov.et', 'Public service center for Kirkos residents'),
('Lideta Community Office', 5, 'Lideta Square', '+251-11-567-8901', 'lideta@addisababa.gov.et', 'Community services and local administration');

-- Insert sample employees
INSERT INTO employees (full_name, email, phone, office_id, position) VALUES
('Amanuel Bekele', 'amanuel.bekele@addisababa.gov.et', '+251-91-123-4567', 1, 'City Administrator'),
('Mesfin Worku', 'mesfin.worku@addisababa.gov.et', '+251-92-234-5678', 1, 'Deputy Administrator'),
('Bereket Tadesse', 'bereket.tadesse@addisababa.gov.et', '+251-93-345-6789', 2, 'District Manager'),
('Sara Haile', 'sara.haile@addisababa.gov.et', '+251-94-456-7890', 3, 'Municipal Officer'),
('Dawit Mengistu', 'dawit.mengistu@addisababa.gov.et', '+251-95-567-8901', 4, 'Service Coordinator');

-- Insert default admin users (password: admin123)
INSERT INTO users (email, password_hash, full_name, role, is_verified) VALUES
('admin@addisababa.gov.et', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.gS8v.m', 'System Administrator', 'system_admin', TRUE),
('government.admin@addisababa.gov.et', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.gS8v.m', 'Government Admin', 'government_admin', TRUE);

-- Insert sample regular user (password: user123)
INSERT INTO users (email, password_hash, full_name, role, is_verified) VALUES
('user@example.com', '$2b$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test User', 'user', TRUE);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_feedback_user_id ON feedback(user_id);
CREATE INDEX idx_feedback_office_id ON feedback(office_id);
CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_admin_id ON chat_sessions(admin_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX idx_verification_codes_user_id ON verification_codes(user_id);
CREATE INDEX idx_verification_codes_code ON verification_codes(code);

-- Show all tables
SHOW TABLES;

-- Show table structures
DESCRIBE users;
DESCRIBE subcities;
DESCRIBE offices;
DESCRIBE employees;
DESCRIBE feedback;
DESCRIBE verification_codes;
DESCRIBE user_settings;
DESCRIBE user_activity;
DESCRIBE chat_sessions;
DESCRIBE chat_messages; 