#!/usr/bin/env python3
import requests
import json

def test_chat_system():
    base_url = "http://localhost:5000"
    
    print("=== TESTING CURRENT CHAT SYSTEM ===")
    
    # Test 1: Login to get a token
    print("\n1. Testing login...")
    login_data = {
        "email": "test@example.com",
        "password": "test123"
    }
    
    try:
        response = requests.post(f"{base_url}/api/login", json=login_data)
        print(f"Login response status: {response.status_code}")
        
        if response.status_code == 200:
            token_data = response.json()
            token = token_data.get('token')
            print(f"Got token: {token[:20]}...")
            
            # Test 2: Create a chat session
            print("\n2. Testing session creation...")
            headers = {"Authorization": f"Bearer {token}"}
            
            session_response = requests.post(f"{base_url}/api/chat/sessions", headers=headers)
            print(f"Session creation status: {session_response.status_code}")
            
            if session_response.status_code == 201:
                session_data = session_response.json()
                session_id = session_data['session']['session_id']
                print(f"Created session ID: {session_id}")
                
                # Test 3: Send a message
                print("\n3. Testing message sending...")
                message_data = {
                    "session_id": session_id,
                    "message": "Hello, this is a test message!"
                }
                
                message_response = requests.post(
                    f"{base_url}/api/chat/messages", 
                    headers=headers, 
                    json=message_data
                )
                print(f"Message sending status: {message_response.status_code}")
                
                if message_response.status_code == 201:
                    print("✅ Message sent successfully!")
                    
                    # Test 4: Get messages
                    print("\n4. Testing message retrieval...")
                    messages_response = requests.get(
                        f"{base_url}/api/chat/messages/{session_id}", 
                        headers=headers
                    )
                    print(f"Message retrieval status: {messages_response.status_code}")
                    
                    if messages_response.status_code == 200:
                        messages_data = messages_response.json()
                        print(f"Retrieved {len(messages_data['messages'])} messages")
                        for msg in messages_data['messages']:
                            print(f"  - {msg['message']} (from user {msg['sender_id']})")
                        print("✅ Message retrieval successful!")
                    else:
                        print(f"❌ Message retrieval failed: {messages_response.text}")
                else:
                    print(f"❌ Message sending failed: {message_response.text}")
            else:
                print(f"❌ Session creation failed: {session_response.text}")
        else:
            print(f"❌ Login failed: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure the Flask app is running.")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_chat_system() 