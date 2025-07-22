#!/usr/bin/env python3
import mysql.connector
from config import Config
from datetime import datetime

def test_chat_insert():
    try:
        # Connect to database
        conn = mysql.connector.connect(
            host=Config.DB_HOST,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME
        )
        cursor = conn.cursor(dictionary=True)
        
        print("=== TESTING CHAT MESSAGE INSERTION ===")
        
        # First, let's check if we have any users
        cursor.execute("SELECT user_id, email, role FROM users LIMIT 5")
        users = cursor.fetchall()
        print(f"Available users: {users}")
        
        if not users:
            print("No users found in database!")
            return
        
        # Get a regular user and an admin
        regular_user = None
        admin_user = None
        
        for user in users:
            if user['role'] == 'user':
                regular_user = user
            elif user['role'] == 'government_admin':
                admin_user = user
        
        print(f"Regular user: {regular_user}")
        print(f"Admin user: {admin_user}")
        
        if not regular_user:
            print("No regular user found!")
            return
        
        if not admin_user:
            print("No admin user found!")
            return
        
        # Test 1: Create a chat session
        print("\n=== TEST 1: Creating chat session ===")
        session_query = """
            INSERT INTO chat_sessions (user_id, admin_id, status, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s)
        """
        
        session_data = (
            regular_user['user_id'],
            admin_user['user_id'],
            'active',
            datetime.now(),
            datetime.now()
        )
        
        print(f"Session data: {session_data}")
        
        cursor.execute(session_query, session_data)
        conn.commit()
        
        session_id = cursor.lastrowid
        print(f"Created session with ID: {session_id}")
        
        # Test 2: Insert a message
        print("\n=== TEST 2: Inserting message ===")
        message_query = """
            INSERT INTO chat_messages (session_id, sender_id, message, is_read, created_at)
            VALUES (%s, %s, %s, %s, %s)
        """
        
        message_data = (
            session_id,
            regular_user['user_id'],
            "Test message from user",
            False,
            datetime.now()
        )
        
        print(f"Message data: {message_data}")
        
        cursor.execute(message_query, message_data)
        conn.commit()
        
        message_id = cursor.lastrowid
        print(f"Created message with ID: {message_id}")
        
        # Test 3: Verify the data was inserted
        print("\n=== TEST 3: Verifying data ===")
        cursor.execute("SELECT * FROM chat_sessions WHERE session_id = %s", (session_id,))
        session = cursor.fetchone()
        print(f"Session in DB: {session}")
        
        cursor.execute("SELECT * FROM chat_messages WHERE message_id = %s", (message_id,))
        message = cursor.fetchone()
        print(f"Message in DB: {message}")
        
        cursor.close()
        conn.close()
        
        print("\n=== TEST COMPLETED SUCCESSFULLY ===")
        
    except Exception as e:
        print(f"Error during test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_chat_insert() 