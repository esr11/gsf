-- Check current structure of chat tables
USE gsf;

-- Check chat_sessions table structure
DESCRIBE chat_sessions;

-- Check chat_messages table structure  
DESCRIBE chat_messages;

-- Show sample data from both tables
SELECT * FROM chat_sessions LIMIT 5;
SELECT * FROM chat_messages LIMIT 5; 