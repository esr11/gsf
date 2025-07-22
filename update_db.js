const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function updateDatabase() {
    let connection;
    try {
        // Read the SQL file
        const sqlFile = path.join(__dirname, 'add_employee_columns.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'gsf',
            multipleStatements: true // Allow multiple statements
        });

        // Execute the SQL commands
        await connection.query(sql);
        console.log('Database updated successfully!');

    } catch (error) {
        console.error('Error updating database:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Run the update
updateDatabase(); 