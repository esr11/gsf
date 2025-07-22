-- Fix chat tables by adding missing columns
USE gsf;

-- Add admin_id column to chat_sessions table
ALTER TABLE chat_sessions 
ADD COLUMN admin_id INT NULL,
ADD FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE SET NULL;

-- Add sender_id column to chat_messages table  
ALTER TABLE chat_messages 
ADD COLUMN sender_id INT NOT NULL,
ADD FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- Verify the changes
DESCRIBE chat_sessions;
DESCRIBE chat_messages; 