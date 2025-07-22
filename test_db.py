import mysql.connector
from config import Config
import os

def execute_sql_file(filename):
    try:
        # Connect to MySQL server
        connection = mysql.connector.connect(
            host=Config.DB_CONFIG['host'],
            user=Config.DB_CONFIG['user'],
            password=Config.DB_CONFIG['password']
        )
        
        cursor = connection.cursor()
        
        # Create database if it doesn't exist
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {Config.DB_CONFIG['database']}")
        cursor.execute(f"USE {Config.DB_CONFIG['database']}")
        
        # Read and execute SQL file
        with open(filename, 'r') as file:
            sql_commands = file.read().split(';')
            
            for command in sql_commands:
                if command.strip():
                    cursor.execute(command)
        
        connection.commit()
        print("Database setup completed successfully!")
        
        # Verify tables and data
        verify_database(connection)
        
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()
            print("MySQL connection is closed")

def verify_database(connection):
    cursor = connection.cursor(dictionary=True)
    
    # Check tables
    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()
    print("\nTables in database:")
    for table in tables:
        table_key = f"Tables_in_{Config.DB_CONFIG['database']}"
        print(f"- {table[table_key]}")
    
    # Check users
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    print("\nUsers (with password hashes):")
    for user in users:
        print(f"- ID: {user['user_id']}, Email: {user['email']}, Role: {user['role']}, Password Hash: {user['password_hash']}")
    
    # Check specific users
    print("\nChecking specific users:")
    test_users = [
        ('bereket.fikadu.atnafu@gmail.com', 'system_admin'),
        ('realbekfikadu.com@gmail.com', 'government_admin')
    ]
    
    for email, role in test_users:
        cursor.execute("SELECT * FROM users WHERE email = %s AND role = %s", (email, role))
        user = cursor.fetchone()
        if user:
            print(f"✓ Found user: {email} (Role: {role})")
        else:
            print(f"✗ Missing user: {email} (Role: {role})")
    
    # Check subcities
    cursor.execute("SELECT * FROM subcities")
    subcities = cursor.fetchall()
    print("\nSubcities:")
    for subcity in subcities:
        print(f"- ID: {subcity['subcity_id']}, Name: {subcity['name']}")
    
    # Check offices
    cursor.execute("""
        SELECT o.office_id, o.name as office_name, s.name as subcity_name 
        FROM offices o 
        JOIN subcities s ON o.subcity_id = s.subcity_id
    """)
    offices = cursor.fetchall()
    print("\nOffices:")
    for office in offices:
        print(f"- ID: {office['office_id']}, Name: {office['office_name']}, Subcity: {office['subcity_name']}")
    
    # Check employees
    cursor.execute("""
        SELECT e.employee_id, e.name, e.position, o.name as office_name 
        FROM employees e 
        JOIN offices o ON e.office_id = o.office_id
    """)
    employees = cursor.fetchall()
    print("\nEmployees:")
    for employee in employees:
        print(f"- ID: {employee['employee_id']}, Name: {employee['name']}, Position: {employee['position']}, Office: {employee['office_name']}")

if __name__ == "__main__":
    execute_sql_file("create_tables.sql") 