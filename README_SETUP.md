# Government Service Feedback System - Setup Guide

This guide will help you set up and run the Government Service Feedback System on your local machine.

## 📋 Prerequisites

Before you start, make sure you have the following installed:

1. **Python 3.8 or higher**
2. **MySQL 8.0 or higher**
3. **Git** (to clone the repository)

## 🚀 Installation Steps

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd gsf11
```

### Step 2: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Set Up MySQL Database

1. **Create MySQL Database:**
   ```sql
   CREATE DATABASE gsf;
   USE gsf;
   ```

2. **Run the Complete Database Setup:**
   ```bash
   mysql -u your_username -p gsf < database_setup_complete.sql
   ```

### Step 4: Configure the Application

1. **Create a `config.py` file** in the root directory:
   ```python
   import os

   class Config:
       # Database Configuration
       DB_HOST = 'localhost'
       DB_USER = 'your_mysql_username'
       DB_PASSWORD = 'your_mysql_password'
       DB_NAME = 'gsf'
       
       # JWT Configuration
       JWT_SECRET_KEY = 'your-secret-key-here-make-it-long-and-random'
       JWT_ALGORITHM = 'HS256'
       JWT_EXPIRATION_HOURS = 24
       
       # Email Configuration (for email verification)
       SMTP_SERVER = 'smtp.gmail.com'
       SMTP_PORT = 587
       SMTP_USERNAME = 'your-email@gmail.com'
       SMTP_PASSWORD = 'your-app-password'
       
       # Database config dictionary
       DB_CONFIG = {
           'host': DB_HOST,
           'user': DB_USER,
           'password': DB_PASSWORD,
           'database': DB_NAME,
           'charset': 'utf8mb4',
           'autocommit': False
       }
   ```

### Step 5: Run the Application

1. **Start the Flask server:**
   ```bash
   python app.py
   ```

2. **Open your browser and go to:**
   ```
   http://localhost:5000
   ```

## 👥 Default Users

The system comes with these default users:

### System Administrator
- **Email:** admin@addisababa.gov.et
- **Password:** admin123
- **Role:** system_admin

### Government Admin
- **Email:** government.admin@addisababa.gov.et
- **Password:** admin123
- **Role:** government_admin

### Test User
- **Email:** user@example.com
- **Password:** user123
- **Role:** user

## 🏢 Sample Data

The database includes:

- **10 Subcities** (Addis Ketema, Arada, Bole, etc.)
- **5 Government Offices** with contact information
- **5 Sample Employees** with their details
- **Chat System** ready to use

## 🔧 Features Available

### For Regular Users:
- ✅ User registration and login
- ✅ Email verification
- ✅ Submit feedback to government offices
- ✅ View feedback history
- ✅ Chat with government support
- ✅ Profile management

### For Government Admins:
- ✅ View and respond to feedback
- ✅ Manage chat sessions
- ✅ View user statistics
- ✅ Office management

### For System Admins:
- ✅ User management
- ✅ System configuration
- ✅ Database administration

## 📁 Important Files

- `app.py` - Main Flask application
- `chat_api.py` - Chat system API
- `database_setup_complete.sql` - Complete database schema
- `config.py` - Configuration file (you need to create this)
- `requirements.txt` - Python dependencies

## 🐛 Troubleshooting

### Common Issues:

1. **Database Connection Error:**
   - Check your MySQL credentials in `config.py`
   - Make sure MySQL is running
   - Verify the database `gsf` exists

2. **Import Errors:**
   - Make sure all dependencies are installed: `pip install -r requirements.txt`

3. **Chat Not Working:**
   - Check that the chat tables were created properly
   - Verify the API endpoints are accessible

4. **Email Not Sending:**
   - Update SMTP settings in `config.py`
   - For Gmail, use App Passwords instead of regular passwords

## 📞 Support

If you encounter any issues:
1. Check the console output for error messages
2. Verify all configuration settings
3. Make sure all dependencies are installed
4. Check that the database was created successfully

## 🎯 Next Steps

After setup:
1. Test the login with default users
2. Try submitting feedback
3. Test the chat system
4. Explore the admin features

Good luck! 🚀 