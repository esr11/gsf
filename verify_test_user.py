#!/usr/bin/env python3
"""
Verify test user in database
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from db import Database
import bcrypt

def verify_test_user():
    """Verify test user exists and check password"""
    db = Database()
    
    print("🔍 Verifying Test User")
    print("=" * 30)
    
    try:
        # Get test user
        user = db.fetch_one(
            "SELECT user_id, email, password_hash, role FROM users WHERE email = %s",
            ("testuser@example.com",)
        )
        
        if user:
            print("✅ Test user found:")
            print(f"  ID: {user['user_id']}")
            print(f"  Email: {user['email']}")
            print(f"  Role: {user['role']}")
            print(f"  Password Hash: {user['password_hash'][:20]}...")
            
            # Test password verification
            test_password = "test123"
            if bcrypt.checkpw(test_password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                print("✅ Password verification successful")
            else:
                print("❌ Password verification failed")
                
        else:
            print("❌ Test user not found")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    verify_test_user() 