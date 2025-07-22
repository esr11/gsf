from db import Database
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def add_full_name_column():
    try:
        db = Database()
        
        # SQL to add full_name column
        query = """
        ALTER TABLE users
        ADD COLUMN full_name VARCHAR(255) AFTER email
        """
        
        logger.info("Adding full_name column to users table...")
        db.execute(query)
        logger.info("Successfully added full_name column to users table")
        
    except Exception as e:
        logger.error(f"Error adding full_name column: {str(e)}")
        raise

if __name__ == "__main__":
    add_full_name_column() 