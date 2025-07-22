const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db/db');

// Get all government admins
router.get('/government-admins', async (req, res) => {
    try {
        const sql = `
            SELECT user_id, email, full_name
            FROM users
            WHERE role = 'government_admin';
        `;
        const admins = await db.query(sql);
        res.json({ success: true, admins });
    } catch (error) {
        console.error('Error fetching government admins:', error);
        res.status(500).json({ success: false, message: 'Error fetching government admins' });
    }
});

// Create new government admin
router.post('/government-admin', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if email already exists
        const checkEmailSql = 'SELECT user_id FROM users WHERE email = ?';
        const existingUser = await db.query(checkEmailSql, [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new government admin
        const sql = `
            INSERT INTO users (
                email,
                password_hash,
                full_name,
                role
            ) VALUES (?, ?, ?, 'government_admin', TRUE, NOW())
        `;
        
        const result = await db.query(sql, [email, hashedPassword, fullName]);
        
        if (result.affectedRows === 1) {
            res.json({ 
                success: true,
                message: 'Government admin created successfully',
                adminId: result.insertId
            });
        } else {
            throw new Error('Failed to create government admin');
        }
    } catch (error) {
        console.error('Error creating government admin:', error);
        res.status(500).json({ success: false, message: 'Error creating government admin' });
    }
});

// Delete government admin
router.delete('/government-admin/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if admin exists
        const checkAdminSql = 'SELECT user_id FROM users WHERE user_id = ? AND role = "government_admin"';
        const admin = await db.query(checkAdminSql, [id]);
        if (admin.length === 0) {
            return res.status(404).json({ success: false, message: 'Government admin not found' });
        }

        // Delete admin
        const sql = 'DELETE FROM users WHERE user_id = ? AND role = "government_admin"';
        const result = await db.query(sql, [id]);

        if (result.affectedRows === 1) {
            res.json({ success: true, message: 'Government admin deleted successfully' });
        } else {
            throw new Error('Failed to delete government admin');
        }
    } catch (error) {
        console.error('Error deleting government admin:', error);
        res.status(500).json({ success: false, message: 'Error deleting government admin' });
    }
});

module.exports = router; 