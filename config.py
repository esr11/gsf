import os
from dotenv import load_dotenv
import secrets

# Load environment variables
load_dotenv()

class Config:
    # Database configuration
    DB_HOST = 'localhost'
    DB_USER = 'root'
    DB_PASSWORD = ''
    DB_NAME = 'gsf'
    
    
    # Database configuration dictionary
    DB_CONFIG = {
        'host': 'localhost',
        'user': 'root',
        'password': '',
        'database': 'gsf',
        'autocommit': False,  # Disable autocommit to enable transactions
        'pool_name': 'gsf_pool',
        'pool_size': 5
    }
    
    # JWT configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', secrets.token_hex(32))  # Generate a secure random key if not set
    JWT_ALGORITHM = 'HS256'
    JWT_EXPIRATION = 86400  # 24 hours in seconds
    
    # File upload configuration
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'doc', 'docx'}
    
    # Ensure upload directory exists
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER) 