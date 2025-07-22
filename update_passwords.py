from db import Database
import bcrypt

def hash_password(password):
    # Generate a salt and hash the password
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def update_user_password(db, email, password):
    hashed_password = hash_password(password)
    query = "UPDATE users SET password_hash = %s WHERE email = %s"
    return db.execute(query, (hashed_password, email))

def main():
    db = Database()
    
    # Update system admin password
    system_admin_email = "bereket.fikadu.atnafu@gmail.com"
    system_admin_password = "b321632f"
    if update_user_password(db, system_admin_email, system_admin_password):
        print(f"Updated password for system admin: {system_admin_email}")
    else:
        print(f"Failed to update password for system admin: {system_admin_email}")
    
    # Update government admin password
    gov_admin_email = "realbekfikadu.com@gmail.com"
    gov_admin_password = "163216"
    if update_user_password(db, gov_admin_email, gov_admin_password):
        print(f"Updated password for government admin: {gov_admin_email}")
    else:
        print(f"Failed to update password for government admin: {gov_admin_email}")

if __name__ == "__main__":
    main() 