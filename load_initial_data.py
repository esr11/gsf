from db import Database
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

def load_initial_data():
    try:
        db = Database()
        
        # Read initial data file
        with open('initial_data.sql', 'r') as file:
            data = file.read()
        
        # Split data into individual statements
        statements = data.split(';')
        
        # Execute each statement
        for statement in statements:
            if statement.strip():
                logger.debug(f"Executing statement: {statement}")
                db.execute(statement)
        
        logger.info("Initial data loaded successfully")
        return True
    except Exception as e:
        logger.error(f"Error loading initial data: {str(e)}")
        return False

if __name__ == '__main__':
    load_initial_data() 