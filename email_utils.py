import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
import os
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Email configuration
SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = os.getenv('SMTP_PORT')
SMTP_USERNAME = os.getenv('SMTP_USERNAME')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
SMTP_DEBUG = os.getenv('SMTP_DEBUG', 'False').lower() in ('true', '1', 't')

def send_email(to_email, subject, html_body=None, text_body=None):
    """General-purpose email sender."""
    if not all([SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD]):
        logger.error("Error: Please make sure SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, and SMTP_PASSWORD are set.")
        return False

    logger.info(f"Attempting to send email to {to_email}...")
    logger.info(f"Using SMTP Server: {SMTP_SERVER}:{SMTP_PORT}")
    logger.info(f"Using SMTP Username: {SMTP_USERNAME}")

    msg = MIMEMultipart('alternative')
    msg['From'] = f"GSF <{SMTP_USERNAME}>"
    msg['To'] = to_email
    msg['Subject'] = subject
    
    if text_body:
        msg.attach(MIMEText(text_body, 'plain'))
    if html_body:
        msg.attach(MIMEText(html_body, 'html'))

    try:
        logger.info(f"Connecting to SMTP server...")
        with smtplib.SMTP(SMTP_SERVER, int(SMTP_PORT), timeout=10) as server:
            if SMTP_DEBUG:
                server.set_debuglevel(1)
            
            is_ssl = int(SMTP_PORT) == 465
            if not is_ssl:
                logger.info("Starting TLS connection...")
                server.starttls()

            logger.info("Attempting SMTP login...")
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            logger.info("Login successful, sending message...")
            server.send_message(msg)
            logger.info(f"--- Email sent successfully to {to_email}! ---")
        return True
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"--- SMTP AUTHENTICATION FAILED ---")
        logger.error(f"SMTP Authentication Error: {e.reason}")
        logger.error("Please check if your SMTP_USERNAME and SMTP_PASSWORD are correct.")
        return False
    except smtplib.SMTPException as e:
        logger.error(f"--- SMTP ERROR ---")
        logger.error(f"An SMTP error occurred: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"--- UNEXPECTED ERROR ---")
        logger.error(f"An unexpected error occurred: {str(e)}")
        return False


def send_verification_email(to_email, verification_code):
    """
    Send a verification email to the user.
    Returns True if email was sent successfully, False otherwise.
    """
    subject = "Email Verification"
    text_body = f"""
    Thank you for registering! Please use the following code to verify your email:
    
    Verification Code: {verification_code}
    
    If you did not request this verification, please ignore this email.
    """
    html_body = f"""
    <html>
        <body>
            <p>Thank you for registering! Please use the following code to verify your email:</p>
            <h2>{verification_code}</h2>
            <p>If you did not request this verification, please ignore this email.</p>
        </body>
    </html>
    """
    return send_email(to_email, subject, html_body=html_body, text_body=text_body)


def send_password_reset_email(email, reset_token):
    """Send a password reset link to the user."""
    base_url = os.getenv("BASE_URL", "http://your-domain.com")
    reset_link = f"{base_url}/reset-password?token={reset_token}"
    subject = "Password Reset Request"
    body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2c3e50;">Password Reset Request</h2>
                <p>You have requested to reset your password. Click the button below to proceed:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}" style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p>If you didn't request this password reset, please ignore this email.</p>
                <p>This link will expire in 1 hour.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                    This is an automated message, please do not reply to this email.
                </p>
            </div>
        </body>
    </html>
    """
    return send_email(email, subject, html_body=body)
