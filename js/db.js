const { executeQuery } = require('./db_utils');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'gsf'
};

// Function to execute database queries
async function executeQuery(sql, params = []) {
    try {
        // Get the authentication token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No authentication token found');
            throw new Error('Not authenticated. Please log in.');
        }

        console.log('Executing query with token:', token.substring(0, 20) + '...');
        console.log('SQL:', sql);
        console.log('Params:', params);

        const response = await fetch('/api/db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                sql: sql,
                params: params
            })
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response text:', responseText);

        if (!response.ok) {
            if (response.status === 401) {
                console.log('Authentication failed. Redirecting to login...');
                localStorage.removeItem('token');
                window.location.href = '/login.html';
                throw new Error('Session expired. Please log in again.');
            }
            let errorMessage;
            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.message || errorData.error || `Database query failed: ${response.statusText}`;
            } catch (e) {
                errorMessage = `Database query failed: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Error parsing response:', e);
            throw new Error('Invalid response from server');
        }

        return data;
    } catch (error) {
        console.error('Database error:', error);
        throw error;
    }
}

// User management functions
const userDB = {
    // Get all users
    getAllUsers: async () => {
        const sql = `
            SELECT u.user_id as id, u.email, u.role, u.is_active as status, u.last_login as lastLogin
            FROM users u
            ORDER BY u.user_id DESC
        `;
        return await executeQuery(sql);
    },

    // Get user by ID
    getUserById: async (id) => {
        const sql = `
            SELECT u.user_id as id, u.email, u.role, u.is_active as status, u.last_login as lastLogin
            FROM users u
            WHERE u.user_id = ?
        `;
        const result = await executeQuery(sql, [id]);
        return result[0];
    },

    // Add new user
    addUser: async (userData) => {
        const sql = `
            INSERT INTO users (email, password_hash, role, is_active, created_at)
            VALUES (?, ?, ?, ?, NOW())
        `;
        const params = [
            userData.email,
            userData.password, // Note: Password should be hashed before storing
            userData.role,
            userData.status || true
        ];
        return await executeQuery(sql, params);
    },

    // Update user
    updateUser: async (id, userData) => {
        const sql = `
            UPDATE users
            SET email = ?,
                role = ?,
                is_active = ?,
                updated_at = NOW()
            WHERE user_id = ?
        `;
        const params = [
            userData.email,
            userData.role,
            userData.status,
            id
        ];
        return await executeQuery(sql, params);
    },

    // Delete user
    deleteUser: async (id) => {
        const sql = 'DELETE FROM users WHERE user_id = ?';
        return await executeQuery(sql, [id]);
    },

    // Update user role
    updateUserRole: async (id, role) => {
        const sql = `
            UPDATE users
            SET role = ?,
                updated_at = NOW()
            WHERE user_id = ?
        `;
        return await executeQuery(sql, [role, id]);
    },

    // Add system log
    addSystemLog: async (action, userId) => {
        const sql = `
            INSERT INTO system_logs (action, user_id, created_at)
            VALUES (?, ?, NOW())
        `;
        return await executeQuery(sql, [action, userId]);
    },

    // Get system logs
    getSystemLogs: async (limit = 10) => {
        const sql = `
            SELECT sl.id, sl.action, sl.created_at as time,
                   u.email as user
            FROM system_logs sl
            LEFT JOIN users u ON sl.user_id = u.user_id
            ORDER BY sl.created_at DESC
            LIMIT ?
        `;
        return await executeQuery(sql, [limit]);
    }
};

// Subcity management functions
const subcityDB = {
    getAllSubcities: async () => {
        const query = `
            SELECT 
                subcity_id,
                name,
                description,
                created_at,
                updated_at,
                is_active
            FROM subcities 
            WHERE is_active = true
            ORDER BY name
        `;
        return await executeQuery(query);
    },

    getSubcityById: async (subcityId) => {
        const query = `
            SELECT 
                subcity_id,
                name,
                description,
                created_at,
                updated_at,
                is_active
            FROM subcities 
            WHERE subcity_id = ? AND is_active = true
        `;
        return await executeQuery(query, [subcityId]);
    },

    addSubcity: async (name, description) => {
        const query = `
            INSERT INTO subcities (name, description, created_at, updated_at, is_active)
            VALUES (?, ?, NOW(), NOW(), true)
        `;
        return await executeQuery(query, [name, description]);
    },

    updateSubcity: async (subcityId, name, description) => {
        const query = `
            UPDATE subcities 
            SET name = ?, description = ?, updated_at = NOW()
            WHERE subcity_id = ?
        `;
        return await executeQuery(query, [name, description, subcityId]);
    },

    deleteSubcity: async (subcityId) => {
        const query = `
            UPDATE subcities 
            SET is_active = false, updated_at = NOW()
            WHERE subcity_id = ?
        `;
        return await executeQuery(query, [subcityId]);
    }
};

// Office management functions
const officeDB = {
    getAllOffices: async () => {
        const query = `
            SELECT 
                o.office_id,
                o.subcity_id,
                o.office_name,
                o.office_desc,
                o.created_at,
                o.updated_at,
                o.is_active,
                s.name as subcity_name
            FROM offices o
            JOIN subcities s ON o.subcity_id = s.subcity_id
            WHERE o.is_active = true AND s.is_active = true
            ORDER BY s.name, o.office_name
        `;
        return await executeQuery(query);
    },

    getOfficesBySubcity: async (subcityId) => {
        const query = `
            SELECT 
                office_id,
                subcity_id,
                office_name,
                office_desc,
                created_at,
                updated_at,
                is_active
            FROM offices 
            WHERE subcity_id = ? AND is_active = true
            ORDER BY office_name
        `;
        return await executeQuery(query, [subcityId]);
    },

    getOfficeById: async (officeId) => {
        const query = `
            SELECT 
                o.office_id,
                o.subcity_id,
                o.office_name,
                o.office_desc,
                o.created_at,
                o.updated_at,
                o.is_active,
                s.name as subcity_name
            FROM offices o
            JOIN subcities s ON o.subcity_id = s.subcity_id
            WHERE o.office_id = ? AND o.is_active = true
        `;
        return await executeQuery(query, [officeId]);
    },

    addOffice: async (subcityId, officeName, officeDesc) => {
        const query = `
            INSERT INTO offices (subcity_id, office_name, office_desc, created_at, updated_at, is_active)
            VALUES (?, ?, ?, NOW(), NOW(), true)
        `;
        return await executeQuery(query, [subcityId, officeName, officeDesc]);
    },

    updateOffice: async (officeId, subcityId, officeName, officeDesc) => {
        const query = `
            UPDATE offices 
            SET subcity_id = ?, office_name = ?, office_desc = ?, updated_at = NOW()
            WHERE office_id = ?
        `;
        return await executeQuery(query, [subcityId, officeName, officeDesc, officeId]);
    },

    deleteOffice: async (officeId) => {
        const query = `
            UPDATE offices 
            SET is_active = false, updated_at = NOW()
            WHERE office_id = ?
        `;
        return await executeQuery(query, [officeId]);
    }
};

// Employee management functions
const employeeDB = {
    getAllEmployees: async () => {
        const query = `
            SELECT 
                e.employee_id,
                e.office_id,
                e.full_name,
                e.position,
                e.photo_url,
                e.email,
                e.created_at,
                e.updated_at,
                e.is_active,
                o.office_name,
                s.name as subcity_name
            FROM employees e
            JOIN offices o ON e.office_id = o.office_id
            JOIN subcities s ON o.subcity_id = s.subcity_id
            WHERE e.is_active = true AND o.is_active = true AND s.is_active = true
            ORDER BY s.name, o.office_name, e.full_name
        `;
        return await executeQuery(query);
    },

    getEmployeesByOffice: async (officeId) => {
        const query = `
            SELECT 
                employee_id,
                office_id,
                full_name,
                position,
                photo_url,
                email,
                created_at,
                updated_at,
                is_active
            FROM employees 
            WHERE office_id = ? AND is_active = true
            ORDER BY full_name
        `;
        return await executeQuery(query, [officeId]);
    },

    getEmployeeById: async (employeeId) => {
        const query = `
            SELECT 
                e.employee_id,
                e.office_id,
                e.full_name,
                e.position,
                e.photo_url,
                e.email,
                e.created_at,
                e.updated_at,
                e.is_active,
                o.office_name,
                s.name as subcity_name,
                s.subcity_id
            FROM employees e
            JOIN offices o ON e.office_id = o.office_id
            JOIN subcities s ON o.subcity_id = s.subcity_id
            WHERE e.employee_id = ? AND e.is_active = true
        `;
        return await executeQuery(query, [employeeId]);
    },

    addEmployee: async (officeId, fullName, position, email, photoUrl) => {
        const query = `
            INSERT INTO employees (office_id, full_name, position, email, photo_url, created_at, updated_at, is_active)
            VALUES (?, ?, ?, ?, ?, NOW(), NOW(), true)
        `;
        return await executeQuery(query, [officeId, fullName, position, email, photoUrl]);
    },

    updateEmployee: async (employeeId, officeId, fullName, position, email, photoUrl) => {
        const query = `
            UPDATE employees 
            SET office_id = ?, full_name = ?, position = ?, email = ?, photo_url = ?, updated_at = NOW()
            WHERE employee_id = ?
        `;
        return await executeQuery(query, [officeId, fullName, position, email, photoUrl, employeeId]);
    },

    deleteEmployee: async (employeeId) => {
        const query = `
            UPDATE employees 
            SET is_active = false, updated_at = NOW()
            WHERE employee_id = ?
        `;
        return await executeQuery(query, [employeeId]);
    },

    searchEmployees: async (searchTerm) => {
        const query = `
            SELECT 
                e.employee_id,
                e.office_id,
                e.full_name,
                e.position,
                e.photo_url,
                e.email,
                o.office_name,
                s.name as subcity_name
            FROM employees e
            JOIN offices o ON e.office_id = o.office_id
            JOIN subcities s ON o.subcity_id = s.subcity_id
            WHERE e.is_active = true 
            AND o.is_active = true 
            AND s.is_active = true
            AND (
                e.full_name LIKE ? 
                OR e.position LIKE ? 
                OR e.email LIKE ?
                OR o.office_name LIKE ?
                OR s.name LIKE ?
            )
            ORDER BY s.name, o.office_name, e.full_name
        `;
        const searchPattern = `%${searchTerm}%`;
        return await executeQuery(query, [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern]);
    }
};

// Export the database functions
module.exports = {
    userDB,
    subcityDB,
    officeDB,
    employeeDB
}; 