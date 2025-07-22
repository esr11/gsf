#!/usr/bin/env python3
import mysql.connector
from config import Config

def check_chat_tables():
    try:
        # Connect to database
        conn = mysql.connector.connect(
            host=Config.DB_HOST,
            user=Config.DB_USER,
            password=Config.DB_PASSWORD,
            database=Config.DB_NAME
        )
        cursor = conn.cursor(dictionary=True)
        
        print("=== CHAT_SESSIONS TABLE STRUCTURE ===")
        cursor.execute("DESCRIBE chat_sessions")
        columns = cursor.fetchall()
        for col in columns:
            print(f"Column: {col['Field']}, Type: {col['Type']}, Null: {col['Null']}, Key: {col['Key']}")
        
        print("\n=== CHAT_MESSAGES TABLE STRUCTURE ===")
        cursor.execute("DESCRIBE chat_messages")
        columns = cursor.fetchall()
        for col in columns:
            print(f"Column: {col['Field']}, Type: {col['Type']}, Null: {col['Null']}, Key: {col['Key']}")
        
        print("\n=== SAMPLE DATA FROM CHAT_SESSIONS ===")
        cursor.execute("SELECT * FROM chat_sessions LIMIT 3")
        sessions = cursor.fetchall()
        for session in sessions:
            print(f"Session: {session}")
        
        print("\n=== SAMPLE DATA FROM CHAT_MESSAGES ===")
        cursor.execute("SELECT * FROM chat_messages LIMIT 3")
        messages = cursor.fetchall()
        for message in messages:
            print(f"Message: {message}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_chat_tables() 