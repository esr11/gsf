import mysql.connector
from mysql.connector import pooling
import os
import logging
from dotenv import load_dotenv

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

# Database configuration
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),
    'database': os.getenv('DB_NAME', 'gsf'),
    'port': int(os.getenv('DB_PORT', 3306))
}

# Create connection pool
try:
    connection_pool = mysql.connector.pooling.MySQLConnectionPool(
        pool_name="mypool",
        pool_size=5,
        **DB_CONFIG
    )
    logger.info("Database connection pool created successfully")
except Exception as e:
    logger.error(f"Error creating database connection pool: {str(e)}")
    raise

class Database:
    def __init__(self):
        self.connection = None
        self.cursor = None

    def __enter__(self):
        try:
            self.connection = connection_pool.get_connection()
            self.cursor = self.connection.cursor(dictionary=True)
            return self
        except Exception as e:
            logger.error(f"Error getting database connection: {str(e)}")
            raise

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()

    def execute(self, query, params=None):
        """Execute a query that modifies data (INSERT, UPDATE, DELETE)"""
        try:
            self.cursor.execute(query, params or ())
            self.connection.commit()
            return self.cursor.rowcount
        except Exception as e:
            self.connection.rollback()
            logger.error(f"Error executing query: {str(e)}")
            raise

    def fetch_one(self, query, params=None):
        """Execute a query and return one result"""
        try:
            self.cursor.execute(query, params or ())
            return self.cursor.fetchone()
        except Exception as e:
            logger.error(f"Error fetching one result: {str(e)}")
            raise

    def fetch_all(self, query, params=None):
        """Execute a query and return all results"""
        try:
            self.cursor.execute(query, params or ())
            return self.cursor.fetchall()
        except Exception as e:
            logger.error(f"Error fetching all results: {str(e)}")
            raise

def get_db():
    """Get a database connection from the pool"""
    return Database() 