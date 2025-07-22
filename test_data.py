#!/usr/bin/env python3
"""
Test script to check if subcities and offices data exists in the database
"""

import mysql.connector
from config import Config

def test_database_data():
    try:
        # Connect to database
        connection = mysql.connector.connect(**Config.DB_CONFIG)
        cursor = connection.cursor(dictionary=True)
        
        print("=== Testing Database Connection ===")
        print("Database connection successful!")
        
        # Check subcities
        print("\n=== Checking Subcities ===")
        cursor.execute("SELECT * FROM subcities")
        subcities = cursor.fetchall()
        print(f"Found {len(subcities)} subcities:")
        for subcity in subcities:
            print(f"  - {subcity['name']} (ID: {subcity['subcity_id']})")
        
        # Check offices structure
        print("\n=== Checking Offices Structure ===")
        cursor.execute("DESCRIBE offices")
        office_structure = cursor.fetchall()
        print("Office table structure:")
        for field in office_structure:
            print(f"  - {field['Field']}: {field['Type']}")
        
        # Check offices data
        print("\n=== Checking Offices ===")
        cursor.execute("SELECT o.*, s.name as subcity_name FROM offices o JOIN subcities s ON o.subcity_id = s.subcity_id LIMIT 10")
        offices = cursor.fetchall()
        print(f"Found {len(offices)} offices (showing first 10):")
        for office in offices:
            print(f"  - {office['office_name']} (ID: {office['office_id']}) in {office['subcity_name']}")
        
        # Check employees
        print("\n=== Checking Employees ===")
        cursor.execute("SELECT e.*, o.office_name, s.name as subcity_name FROM employees e JOIN offices o ON e.office_id = o.office_id JOIN subcities s ON o.subcity_id = s.subcity_id")
        employees = cursor.fetchall()
        print(f"Found {len(employees)} employees:")
        for employee in employees:
            print(f"  - {employee['name']} (ID: {employee['employee_id']}) at {employee['office_name']} in {employee['subcity_name']}")
        
        cursor.close()
        connection.close()
        print("\n=== Test completed successfully ===")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_database_data() 