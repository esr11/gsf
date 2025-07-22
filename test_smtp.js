require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('Attempting to send a test email...');
    console.log(`Using SMTP Server: ${process.env.SMTP_SERVER}:${process.env.SMTP_PORT}`);
    console.log(`Using SMTP Username: ${process.env.SMTP_USERNAME}`);

    if (!process.env.SMTP_SERVER || !process.env.SMTP_PORT || !process.env.SMTP_USERNAME || !process.env.SMTP_PASSWORD) {
        console.error('Error: Please make sure SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, and SMTP_PASSWORD are set in your .env file.');
        return;
    }

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

    try {
        console.log('--- Sending test message ---');
        const info = await transporter.sendMail({
            from: `"SMTP Test" <${process.env.SMTP_USERNAME}>`,
            to: process.env.SMTP_USERNAME, // Sending to yourself for the test
            subject: 'SMTP Connection Test',
            text: 'This is a test email to verify your SMTP settings.',
            html: '<p>This is a test email to verify your SMTP settings.</p>'
        });

        console.log('--- Test email sent successfully! ---');
        console.log('Message ID:', info.messageId);

    } catch (error) {
        console.error('--- SMTP TEST FAILED ---');
        console.error('An error occurred during the SMTP test.');
        if (error.code) console.error(`Error Code: ${error.code}`);
        if (error.response) console.error(`Error Response: ${error.response}`);
        if (error.responseCode) console.error(`Error Response Code: ${error.responseCode}`);
        console.error('Full Error Object:', error);
        console.error('--- END OF ERROR REPORT ---');
    }
}

testEmail(); 