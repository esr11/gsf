const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const emailVerificationRoutes = require('./routes/email_verification');
const multer = require('multer');
const db = require('./db/db');
const fs = require('fs');

const app = express();

// Set default JWT secret if not provided
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Routes
app.use('/api', emailVerificationRoutes);
app.use('/api/employees', authenticateToken, require('./api/employee_routes'));
app.use('/api', authenticateToken, require('./api/subcity_routes'));
app.use('/api', authenticateToken, require('./api/government_admin_routes'));

// Add system health endpoint
app.get('/api/system-health', authenticateToken, async (req, res) => {
    try {
        // For now, return mock data
        res.json({
            cpu: Math.floor(Math.random() * 100),
            memory: Math.floor(Math.random() * 100),
            disk: Math.floor(Math.random() * 100),
            network: Math.floor(Math.random() * 100)
        });
    } catch (error) {
        console.error('Error fetching system health:', error);
        res.status(500).json({ error: 'Failed to fetch system health' });
    }
});

// Add security logs endpoint
app.get('/api/security-logs', authenticateToken, async (req, res) => {
    try {
        // For now, return mock data
        res.json({
            logs: [
                {
                    time: new Date().toISOString(),
                    user: 'System Admin',
                    action: 'Created new government admin',
                    ip: '127.0.0.1'
                }
            ]
        });
    } catch (error) {
        console.error('Error fetching security logs:', error);
        res.status(500).json({ error: 'Failed to fetch security logs' });
    }
});

// Add failed logins endpoint
app.get('/api/failed-logins', authenticateToken, async (req, res) => {
    try {
        // For now, return mock data
        res.json({
            logins: [
                {
                    time: new Date().toISOString(),
                    username: 'test@example.com',
                    ip: '127.0.0.1',
                    status: 'Failed'
                }
            ]
        });
    } catch (error) {
        console.error('Error fetching failed logins:', error);
        res.status(500).json({ error: 'Failed to fetch failed logins' });
    }
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'employee_photos');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email is verified
        const checkVerifiedSql = 'SELECT email_verified FROM users WHERE email = ?';
        const verificationResult = await db.query(checkVerifiedSql, [email]);

        if (!verificationResult[0]?.email_verified) {
            return res.status(400).json({ error: 'Email not verified' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const sql = `
            INSERT INTO users (
                email, 
                password_hash, 
                role, 
                is_active, 
                created_at
            ) VALUES (?, ?, 'user', TRUE, NOW())
        `;
        
        const result = await db.query(sql, [email, hashedPassword]);
        
        if (result.affectedRows === 1) {
            // Generate JWT token
            const token = jwt.sign(
                { userId: result.insertId, email, role: 'user' },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ 
                message: 'User registered successfully',
                token 
            });
        } else {
            throw new Error('Failed to create user');
        }
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Get user
        const sql = `
            SELECT user_id, email, password_hash, role, is_active 
            FROM users 
            WHERE email = ?
        `;
        const users = await db.query(sql, [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        // Check if user is active
        if (!user.is_active) {
            return res.status(401).json({ error: 'Account is inactive' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login
        await db.query(
            'UPDATE users SET last_login = NOW() WHERE user_id = ?',
            [user.user_id]
        );

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.user_id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.user_id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 