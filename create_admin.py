from db import Database
import bcrypt

def create_admin_user():
    db = Database()
    
    # Admin credentials
    email = "admin@government.gov"
    password = "Admin@123"  # This is a temporary password, should be changed after first login
    full_name = "System Administrator"
    
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    try:
        # Check if admin already exists
        existing_admin = db.fetch_one("SELECT user_id FROM users WHERE email = %s", (email,))
        
        if existing_admin:
            print("Admin user already exists")
            return
        
        # Create admin user
        query = """
        INSERT INTO users (email, password_hash, full_name, is_active)
        VALUES (%s, %s, %s, TRUE)
        """
        db.execute(query, (email, hashed_password.decode('utf-8'), full_name))
        
        # Get the new user's ID
        user = db.fetch_one("SELECT user_id FROM users WHERE email = %s", (email,))
        
        # Create admin record
        query = """
        INSERT INTO admin_users (user_id, role, permissions)
        VALUES (%s, 'system_admin', '{"all": true}')
        """
        db.execute(query, (user['user_id'],))
        
        print("Admin user created successfully!")
        print(f"Email: {email}")
        print(f"Password: {password}")
        print("Please change this password after first login!")
        
    except Exception as e:
        print(f"Error creating admin user: {str(e)}")

if __name__ == "__main__":
    create_admin_user() 