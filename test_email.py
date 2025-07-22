import os
from dotenv import load_dotenv
from email_utils import send_verification_email, send_password_reset_email

# Load environment variables from .env file
load_dotenv()

def test_email_sending():
    """
    Tests the email sending functionality.
    """
    print("--- Running Email Sending Test ---")
    
    # Get the email address to send to from environment variables
    # This should be your own email for testing purposes
    test_email_recipient = os.getenv('SMTP_USERNAME')
    
    if not test_email_recipient:
        print("SMTP_USERNAME is not set in the .env file. Skipping test.")
        return

    print(f"Test email recipient: {test_email_recipient}")

    # --- Test 1: Send Verification Email ---
    print("\n--- Testing Verification Email ---")
    verification_code = "123456"
    print(f"Sending verification email with code: {verification_code}")
    success = send_verification_email(test_email_recipient, verification_code)
    if success:
        print("Verification email test PASSED.")
    else:
        print("Verification email test FAILED.")

    # --- Test 2: Send Password Reset Email ---
    print("\n--- Testing Password Reset Email ---")
    reset_token = "dummy-reset-token-abcdef123456"
    print(f"Sending password reset email with token: {reset_token}")
    success_reset = send_password_reset_email(test_email_recipient, reset_token)
    if success_reset:
        print("Password reset email test PASSED.")
    else:
        print("Password reset email test FAILED.")


    print("\n--- Email Sending Test Finished ---")


if __name__ == "__main__":
    test_email_sending() 