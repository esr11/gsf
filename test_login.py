import requests
import json

def test_login(email, password):
    url = 'http://localhost:5000/api/login'
    data = {
        'email': email,
        'password': password
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"\nTesting login for: {email}")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Login successful!")
            print(f"Role: {data['role']}")
            print(f"Token: {data['token'][:20]}...")
        else:
            print("Login failed!")
            
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    # Test system admin login
    test_login('bereket.fikadu.atnafu@gmail.com', 'b321632f')
    
    # Test government admin login
    test_login('realbekfikadu.com@gmail.com', '163216')
    
    # Test invalid login
    test_login('wrong@email.com', 'wrongpassword') 