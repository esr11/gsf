import os

class Config:
    # Database Configuration
    DB_HOST = 'localhost'
    DB_USER = 'your_mysql_username'  # Change this to your MySQL username
    DB_PASSWORD = 'your_mysql_password'  # Change this to your MySQL password
    DB_NAME = 'gsf'
    
    # JWT Configuration
    JWT_SECRET_KEY = 'your-super-secret-jwt-key-change-this-to-something-random-and-long'
    JWT_ALGORITHM = 'HS256'
    JWT_EXPIRATION_HOURS = 24
    
    # Email Configuration (for email verification)
    SMTP_SERVER = 'smtp.gmail.com'
    SMTP_PORT = 587
    SMTP_USERNAME = 'your-email@gmail.com'  # Change this to your email
    SMTP_PASSWORD = 'your-app-password'  # Change this to your app password
    
    # Database config dictionary
    DB_CONFIG = {
        'host': DB_HOST,
        'user': DB_USER,
        'password': DB_PASSWORD,
        'database': DB_NAME,
        'charset': 'utf8mb4',
        'autocommit': False
    } 