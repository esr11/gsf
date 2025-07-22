require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const db = require('../db');

// Store verification codes temporarily (in production, use Redis or similar)
const verificationCodes = new Map();

// Generate a random 6-digit code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification code
router.post('/send-verification', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email already exists
        const checkSql = 'SELECT user_id FROM users WHERE email = ?';
        const existingUser = await db.query(checkSql, [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Generate verification code
        const code = generateVerificationCode();
        
        // Store code with 10-minute expiration
        verificationCodes.set(email, {
            code,
            expires: Date.now() + 10 * 60 * 1000 // 10 minutes
        });

        // Configure email transporter for SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_SERVER,
            port: parseInt(process.env.SMTP_PORT, 10),
            secure: parseInt(process.env.SMTP_PORT, 10) === 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
            debug: true, // show debug output
            logger: true // log to console
        });

        // Send email
        const mailOptions = {
            from: `"GSF Portal" <${process.env.SMTP_USERNAME}>`,
            to: email,
            subject: 'Email Verification Code - GSF Portal',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #0d6efd;">Email Verification</h2>
                    <p>Thank you for signing up for the GSF Portal. Please use the following code to verify your email address:</p>
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #0d6efd; margin: 0;">${code}</h1>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                    <hr style="border: 1px solid #dee2e6; margin: 20px 0;">
                    <p style="color: #6c757d; font-size: 12px;">This is an automated message, please do not reply.</p>
                </div>
            `
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', info.messageId);
        
        res.json({ message: 'Verification code sent successfully' });
    } catch (error) {
        console.error('--- SMTP-RELATED ERROR ---');
        console.error('An error occurred while trying to send the verification email.');
        if (error.code) console.error(`Error Code: ${error.code}`);
        if (error.response) console.error(`Error Response: ${error.response}`);
        if (error.responseCode) console.error(`Error Response Code: ${error.responseCode}`);
        console.error('Full Error Object:', error);
        console.error('--- END SMTP-RELATED ERROR ---');
        res.status(500).json({ error: 'Failed to send verification code: ' + error.message });
    }
});

// Verify code
router.post('/verify-code', async (req, res) => {
    try {
        const { email, code } = req.body;

        // Get stored verification data
        const verificationData = verificationCodes.get(email);

        if (!verificationData) {
            return res.status(400).json({ error: 'No verification code found for this email' });
        }

        // Check if code has expired
        if (Date.now() > verificationData.expires) {
            verificationCodes.delete(email);
            return res.status(400).json({ error: 'Verification code has expired' });
        }

        // Verify code
        if (code !== verificationData.code) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }

        // Code is valid, remove it from storage
        verificationCodes.delete(email);

        // Mark email as verified in the database
        const updateSql = 'UPDATE users SET email_verified = TRUE WHERE email = ?';
        await db.query(updateSql, [email]);

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ error: 'Failed to verify code' });
    }
});

module.exports = router; 