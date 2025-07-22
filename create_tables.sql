USE gsf;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chat_sessions;
DROP TABLE IF EXISTS feedback;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS offices;
DROP TABLE IF EXISTS subcities;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS system_settings;
DROP TABLE IF EXISTS employee_ratings;

-- Create users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('user', 'government_admin', 'system_admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create subcities table
CREATE TABLE subcities (
    subcity_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create offices table
CREATE TABLE offices (
    office_id INT AUTO_INCREMENT PRIMARY KEY,
    subcity_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subcity_id) REFERENCES subcities(subcity_id) ON DELETE CASCADE,
    UNIQUE KEY unique_office_subcity (name, subcity_id)
);

-- Create employees table
CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    office_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    photo_url VARCHAR(255),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (office_id) REFERENCES offices(office_id) ON DELETE CASCADE,
    UNIQUE KEY unique_employee_office (name, office_id)
);

-- Create feedback table
CREATE TABLE feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    office_id INT NOT NULL,
    employee_id INT,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    status ENUM('pending', 'in_progress', 'resolved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (office_id) REFERENCES offices(office_id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE SET NULL
);

-- Create chat_sessions table
CREATE TABLE chat_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    admin_id INT,
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

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('session_timeout', '60', 'Session timeout in minutes'),
('max_login_attempts', '5', 'Maximum number of failed login attempts before account lockout'),
('enable_two_factor', 'false', 'Enable two-factor authentication for all users');

-- Insert default system admin
-- Password: b321632f
INSERT INTO users (email, password_hash, role) 
VALUES ('bereket.fikadu.atnafu@gmail.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'system_admin');

-- Insert government admin
-- Password: 163216
INSERT INTO users (email, password_hash, role)
VALUES ('realbekfikadu.com@gmail.com', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'government_admin');

-- Insert all subcities
INSERT INTO subcities (name, description) VALUES
('Addis Ketema', 'Located in the northwestern part of the city, near the center. Known for its historical significance and commercial activities.'),
('Akaky Kaliti', 'Located in the southern part of the city, known for its industrial zones and residential areas.'),
('Arada', 'Situated in the northern area of the city, close to the center. Known for its cultural heritage and historical sites.'),
('Bole', 'Known for Bole International Airport and modern developments. A major commercial and diplomatic hub of the city.'),
('Gullele', 'Located in the northern area of the city, known for its residential areas and educational institutions.'),
('Kirkos', 'A central sub-city in Addis Ababa, known for its administrative offices and commercial activities.'),
('Kolfe Keranio', 'Located in the northwestern part of the city, known for its residential areas and local markets.'),
('Lideta', 'A sub-city in Addis Ababa known for its commercial areas and residential neighborhoods.'),
('Nifas Silk-Lafto', 'Another sub-city in the city, known for its residential areas and local businesses.'),
('Yeka', 'Located in the northern area of the city, known for its residential areas and diplomatic missions.');

-- Insert sample offices for Bole subcity
INSERT INTO offices (subcity_id, name, description) VALUES
(1, 'Bole Woreda 3', 'Bole Woreda 3 Administration Office'),
(1, 'Bole Woreda 4', 'Bole Woreda 4 Administration Office'),
(1, 'Bole Woreda 5', 'Bole Woreda 5 Administration Office');

-- Insert sample employees
INSERT INTO employees (office_id, name, position) VALUES
(1, 'Alemayehu Kebede', 'Office Manager'),
(1, 'Mekdes Hailu', 'Customer Service Officer'),
(2, 'Yohannes Assefa', 'Office Manager'),
(2, 'Selamawit Tesfaye', 'Customer Service Officer'),
(3, 'Tewodros Abebe', 'Office Manager'),
(3, 'Hirut Lemma', 'Customer Service Officer'); 

-- Create employee_ratings table
CREATE TABLE employee_ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_employee_user_rating (employee_id, user_id)
); 