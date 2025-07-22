import os
import secrets
import string
from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, session
from werkzeug.security import check_password_hash, generate_password_hash
import logging
from database import get_db
from email_utils import send_verification_email
from functools import wraps
import jwt
from config import Config

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__)

def generate_verification_code():
    """Generate a 6-digit verification code."""
    return ''.join(secrets.choice(string.digits) for _ in range(6))

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password are required'}), 400

        db = get_db()
        user = db.fetch_one(
            "SELECT * FROM users WHERE email = %s",
            (email,)
        )

        if not user or not check_password_hash(user['password'], password):
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

        # Generate verification code
        verification_code = generate_verification_code()
        expires_at = datetime.utcnow() + timedelta(minutes=10)

        # Store verification code in database
        db.execute(
            """
            INSERT INTO verification_codes (user_id, code, created_at, expires_at, is_used)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (user['user_id'], verification_code, datetime.utcnow(), expires_at, False)
        )

        # Send verification email
        if not send_verification_email(email, verification_code):
            return jsonify({'success': False, 'message': 'Error sending verification email'}), 500

        # Store user_id in session for verification step
        session['pending_user_id'] = user['user_id']

        return jsonify({
            'success': True,
            'message': 'Verification code sent to your email',
            'requires_verification': True
        }), 200

    except Exception as e:
        logger.error(f"Error in login: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@auth_bp.route('/verify-code', methods=['POST'])
def verify_code():
    try:
        data = request.get_json()
        code = data.get('code')
        pending_user_id = session.get('pending_user_id')

        if not code or not pending_user_id:
            return jsonify({'success': False, 'message': 'Verification code is required'}), 400

        db = get_db()
        verification = db.fetch_one(
            """
            SELECT * FROM verification_codes 
            WHERE user_id = %s AND code = %s AND is_used = %s AND expires_at > %s
            ORDER BY created_at DESC LIMIT 1
            """,
            (pending_user_id, code, False, datetime.utcnow())
        )

        if not verification:
            return jsonify({'success': False, 'message': 'Invalid or expired verification code'}), 401

        # Mark verification code as used
        db.execute(
            "UPDATE verification_codes SET is_used = %s WHERE id = %s",
            (True, verification['id'])
        )

        # Get user details
        user = db.fetch_one(
            "SELECT user_id, email, full_name, role FROM users WHERE user_id = %s",
            (pending_user_id,)
        )

        # Set session variables
        session['user_id'] = user['user_id']
        session['email'] = user['email']
        session['full_name'] = user['full_name']
        session['role'] = user['role']

        # Clear pending user_id
        session.pop('pending_user_id', None)

        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': {
                'user_id': user['user_id'],
                'email': user['email'],
                'full_name': user['full_name'],
                'role': user['role']
            }
        }), 200

    except Exception as e:
        logger.error(f"Error in verify_code: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    try:
        session.clear()
        return jsonify({'success': True, 'message': 'Logged out successfully'}), 200
    except Exception as e:
        logger.error(f"Error in logout: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            current_user = data
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def generate_token(user_data):
    token = jwt.encode({
        'user': user_data,
        'exp': datetime.utcnow() + timedelta(days=1)
    }, Config.SECRET_KEY)
    return token 