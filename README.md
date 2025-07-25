# Government Service Feedback Portal

A web application for citizens to provide feedback on government services in Addis Ababa.

## Setup Instructions

### 1. Database Setup
1. Install MySQL if not already installed
2. Create a new database:
   ```sql
   CREATE DATABASE gsf;
   ```
3. Import the database schema:
   ```bash
   mysql -u root gsf < create_tables.sql
   ```

### 2. Python Environment Setup
1. Install Python 3.x if not already installed
2. Install required packages:
   ```bash
   pip install flask flask-mysql
   ```

### 3. Configuration
1. Update `config.py` with your MySQL credentials if different from default:
   ```python
   MYSQL_HOST = 'localhost'
   MYSQL_USER = 'root'
   MYSQL_PASSWORD = ''  # Your MySQL password
   MYSQL_DB = 'gsf'
   ```

### 4. Running the Application
1. Start the Flask server:
   ```bash
   python app.py
   ```
2. Access the application at:
   - Local: http://localhost:5000
   - Network: http://[your-ip]:5000

## Default Admin Accounts
- System Admin:
  - Email: bereket.fikadu.atnafu@gmail.com
  - Password: b321632f
- Government Admin:
  - Email: realbekfikadu.com@gmail.com
  - Password: 163216

## Project Structure
```
GSF/
├── app.py              # Main Flask application
├── config.py           # Configuration settings
├── db.py              # Database connection
├── create_tables.sql   # Database schema
├── home.html          # Home page
├── login.html         # Login page
├── signup.html        # Signup page
├── subcity.html       # Subcity selection
├── office.html        # Office details
├── css/               # Stylesheets
├── js/                # JavaScript files
└── images/            # Image assets
```

## Notes
- Always access the application through the Flask server (not by opening HTML files directly)
- Make sure MySQL server is running before starting the application
- Default MySQL configuration assumes:
  - Host: localhost
  - User: root
  - Password: (empty)
  - Database: gsf

## File Structure and Purpose

### Core Application Files

1. `app.py`
   - Main application file
   - Handles Flask server setup and API endpoints
   - Serves frontend files
   - This is the only file needed to run the application
   - Usage: `python app.py`

2. `db.py`
   - Database connection and utility functions
   - Handles database operations and queries

3. `config.py`
   - Configuration settings for the application
   - Contains database credentials and other settings

### Database Management Files

1. `create_tables.sql`
   - SQL script to create database tables
   - Run this first when setting up the database

2. `database_setup.sql`
   - Initial database setup script
   - Creates initial data and configurations

3. `test_db.py`
   - Database verification tool
   - Checks if:
     - All tables exist
     - Users are properly created
     - Subcities and offices are set up
     - Employees are added
   - Usage: Run only when you need to verify database state

4. `update_passwords.py`
   - Password management utility
   - Updates password hashes for admin users
   - Usage: Run only when:
     - Changing admin passwords
     - Password hashes are corrupted
     - Setting up the system for the first time

### Frontend Files

1. HTML Files:
   - `home.html` - Main landing page
   - `subcity.html` - Sub-city information page
   - `office.html` - Office information page
   - `login.html` - User login page
   - `signup.html` - User registration page
   - `contact.html` - Contact information page
   - `feedback.html` - Feedback submission page
   - `profile.html` - User profile page
   - `verification.html` - Email verification page
   - `government_admin.html` - Government admin dashboard
   - `system_admin.html` - System admin dashboard

2. Static Files:
   - `css/` - Stylesheets
   - `js/` - JavaScript files
   - `images/` - Image assets
   - `uploads/` - File uploads directory

## Getting Started

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up the database:
   - Run `create_tables.sql`
   - Run `database_setup.sql`
   - (Optional) Run `test_db.py` to verify setup

3. Start the application:
   ```bash
   python app.py
   ```

4. Access the application:
   - Open `http://192.168.1.16:5000/` in your browser

## Maintenance

- Use `test_db.py` to verify database state
- Use `update_passwords.py` to manage admin passwords
- Regular application restarts only require running `app.py`

## Note

Files with 'a' suffix (e.g., `homea.html`, `logina.html`) are alternative versions and should not be used in production. "# gsf" 
#   g s f  
 #   g s f  
 "# gsf" 
#   g s f  
 