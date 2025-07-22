from db import Database
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def create_tables():
    try:
        db = Database()
        
        # Read schema file
        with open('schema.sql', 'r') as file:
            schema = file.read()
        
        # Split schema into individual statements
        statements = schema.split(';')
        
        # Execute each statement
        for statement in statements:
            if statement.strip():
                logger.debug(f"Executing statement: {statement}")
                db.execute(statement)
        
        logger.info("Database tables created successfully")
        return True
    except Exception as e:
        logger.error(f"Error creating tables: {str(e)}")
        return False

if __name__ == '__main__':
    create_tables() 