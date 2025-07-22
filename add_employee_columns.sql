-- Add new columns to employees table
ALTER TABLE employees
ADD COLUMN photo_url VARCHAR(255) AFTER position,
ADD COLUMN email VARCHAR(255) AFTER photo_url;

-- Create employee_ratings table if it doesn't exist
CREATE TABLE IF NOT EXISTS employee_ratings (
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