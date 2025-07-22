USE gsf;

-- Create verification_codes table
CREATE TABLE IF NOT EXISTS verification_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    code VARCHAR(6) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX idx_verification_code ON verification_codes(code);
CREATE INDEX idx_verification_user ON verification_codes(user_id);
CREATE INDEX idx_verification_expires ON verification_codes(expires_at); 