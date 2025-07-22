const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('../db/db');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/employee_photos/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'employee-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Add new employee
router.post('/employees', upload.single('photo'), async (req, res) => {
    try {
        const { name, position, office_id, email } = req.body;
        const photo_url = req.file ? `/uploads/employee_photos/${req.file.filename}` : null;

        const result = await db.query(
            'INSERT INTO employees (name, position, office_id, email, photo_url) VALUES (?, ?, ?, ?, ?)',
            [name, position, office_id, email, photo_url]
        );

        res.status(201).json({
            success: true,
            message: 'Employee added successfully',
            employee_id: result.insertId
        });
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding employee'
        });
    }
});

// Get all employees
router.get('/employees', async (req, res) => {
    try {
        const employees = await db.query(`
            SELECT e.*, o.name as office_name, 
                   COALESCE(AVG(r.rating), 0) as average_rating,
                   COUNT(r.rating_id) as total_ratings
            FROM employees e
            LEFT JOIN offices o ON e.office_id = o.office_id
            LEFT JOIN employee_ratings r ON e.employee_id = r.employee_id
            WHERE e.is_active = true
            GROUP BY e.employee_id
        `);

        res.json({
            success: true,
            employees: employees
        });
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching employees'
        });
    }
});

// Submit employee feedback
router.post('/employees/:employeeId/feedback', async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { rating, feedback_text } = req.body;
        const userId = req.user.user_id; // Assuming you have authentication middleware

        await db.query(
            'INSERT INTO employee_ratings (employee_id, user_id, rating, feedback_text) VALUES (?, ?, ?, ?)',
            [employeeId, userId, rating, feedback_text]
        );

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully'
        });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting feedback'
        });
    }
});

// Update employee
router.put('/employees/:employeeId', upload.single('photo'), async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { name, position, office_id, email } = req.body;
        const photo_url = req.file ? `/uploads/employee_photos/${req.file.filename}` : undefined;

        let query = 'UPDATE employees SET name = ?, position = ?, office_id = ?, email = ?';
        let params = [name, position, office_id, email];

        if (photo_url) {
            query += ', photo_url = ?';
            params.push(photo_url);
        }

        query += ' WHERE employee_id = ?';
        params.push(employeeId);

        await db.query(query, params);

        res.json({
            success: true,
            message: 'Employee updated successfully'
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating employee'
        });
    }
});

// Delete employee
router.delete('/employees/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;

        await db.query('UPDATE employees SET is_active = false WHERE employee_id = ?', [employeeId]);

        res.json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting employee'
        });
    }
});

module.exports = router; 