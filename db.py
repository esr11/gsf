import mysql.connector
from mysql.connector import Error
from config import Config
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance.connect()  # Connect when instance is created
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, 'connection') or not self.connection or not self.connection.is_connected():
            self.connect()
    
    def connect(self):
        try:
            logger.debug("Attempting to connect to database...")
            self.connection = mysql.connector.connect(**Config.DB_CONFIG)
            self.cursor = self.connection.cursor(dictionary=True)
            logger.info("Successfully connected to MySQL database")
            return True
        except Error as e:
            logger.error(f"Error connecting to MySQL: {e}")
            return False
    
    def disconnect(self):
        try:
            if self.cursor:
                self.cursor.close()
            if self.connection:
                self.connection.close()
            logger.info("Successfully disconnected from database")
        except Error as e:
            logger.error(f"Error disconnecting from database: {e}")
    
    def reset_transaction(self):
        """Reset any active transaction state"""
        try:
            if self.connection and self.connection.is_connected():
                self.connection.rollback()
                logger.debug("Transaction state reset")
                return True
            return False
        except Error as e:
            logger.error(f"Error resetting transaction: {e}")
            return False
    
    def execute(self, query, params=None):
        try:
            if not self.connection or not self.connection.is_connected():
                logger.debug("Connection lost, attempting to reconnect...")
                self.connect()
            
            # Convert params to tuple if it's a list
            if isinstance(params, list):
                params = tuple(params)
            
            logger.debug(f"Executing query: {query}")
            logger.debug(f"With params: {params}")
            
            self.cursor.execute(query, params or ())
            logger.debug("Query executed successfully")
            return True
        except Error as e:
            logger.error(f"Error executing query: {e}")
            raise e
    
    def commit(self):
        """Commit the current transaction"""
        try:
            if self.connection and self.connection.is_connected():
                self.connection.commit()
                logger.debug("Transaction committed")
                return True
            return False
        except Error as e:
            logger.error(f"Error committing transaction: {e}")
            return False
    
    def rollback(self):
        """Rollback the current transaction"""
        try:
            if self.connection and self.connection.is_connected():
                self.connection.rollback()
                logger.debug("Transaction rolled back")
                return True
            return False
        except Error as e:
            logger.error(f"Error rolling back transaction: {e}")
            return False
    
    def fetch_one(self, query, params=None):
        try:
            if not self.connection or not self.connection.is_connected():
                logger.debug("Connection lost, attempting to reconnect...")
                self.connect()
            
            logger.debug(f"Executing fetch_one query: {query}")
            logger.debug(f"With params: {params}")
            
            self.cursor.execute(query, params or ())
            result = self.cursor.fetchone()
            logger.debug(f"Query result: {result}")
            return result
        except Error as e:
            logger.error(f"Error fetching one: {e}")
            return None
    
    def fetch_all(self, query, params=None):
        try:
            if not self.connection or not self.connection.is_connected():
                logger.debug("Connection lost, attempting to reconnect...")
                self.connect()
            
            logger.debug(f"Executing fetch_all query: {query}")
            logger.debug(f"With params: {params}")
            
            self.cursor.execute(query, params or ())
            results = self.cursor.fetchall()
            logger.debug(f"Query returned {len(results)} results")
            return results
        except Error as e:
            logger.error(f"Error fetching all: {e}")
            return [] 