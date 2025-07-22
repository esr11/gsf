#!/usr/bin/env python3
"""
Script to check database contents and identify issues.
"""

from db import Database
import json

def check_database():
    """Check database contents and identify issues."""
    
    db = Database()
    
    print("=== Database Check ===")
    
    # Check if tables exist and have data
    tables_to_check = [
        'users',
        'subcities', 
        'offices',
        'employees'
    ]
    
    for table in tables_to_check:
        try:
            # Check if table exists
            result = db.fetch_one(f"SELECT COUNT(*) as count FROM {table}")
            if result:
                count = result['count']
                print(f"✓ {table}: {count} records")
                
                # Show sample data for small tables
                if count > 0 and count <= 10:
                    sample = db.fetch_all(f"SELECT * FROM {table} LIMIT 3")
                    print(f"  Sample data: {json.dumps(sample, default=str, indent=2)}")
                elif count == 0:
                    print(f"  ⚠️  {table} table is empty!")
            else:
                print(f"✗ {table}: Table not found or error")
                
        except Exception as e:
            print(f"✗ {table}: Error - {str(e)}")
    
    print("\n=== Checking specific issues ===")
    
    # Check subcities table structure
    try:
        subcities = db.fetch_all("SELECT * FROM subcities LIMIT 5")
        print(f"Subcities table has {len(subcities)} records")
        if subcities:
            print("Sample subcity:", subcities[0])
    except Exception as e:
        print(f"Error checking subcities: {str(e)}")
    
    # Check offices table structure
    try:
        offices = db.fetch_all("SELECT * FROM offices LIMIT 5")
        print(f"Offices table has {len(offices)} records")
        if offices:
            print("Sample office:", offices[0])
    except Exception as e:
        print(f"Error checking offices: {str(e)}")
    
    # Check users table for government admins
    try:
        gov_admins = db.fetch_all("SELECT user_id, email, role FROM users WHERE role = 'government_admin'")
        print(f"Government admins: {len(gov_admins)}")
        if gov_admins:
            print("Government admins:", gov_admins)
    except Exception as e:
        print(f"Error checking government admins: {str(e)}")

if __name__ == "__main__":
    check_database() 