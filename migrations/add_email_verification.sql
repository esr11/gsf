-- Add email_verified column to users table
ALTER TABLE users
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;

-- Add verification_code column to users table
ALTER TABLE users
ADD COLUMN verification_code VARCHAR(6);

-- Add verification_code_expires column to users table
ALTER TABLE users
ADD COLUMN verification_code_expires DATETIME; 