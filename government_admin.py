from flask import Blueprint, request, jsonify, render_template
from functools import wraps
from werkzeug.utils import secure_filename
import os, logging, jwt

from db import Database
from config import Config

government_admin_bp = Blueprint('government_admin', __name__)
db = Database()
logger = logging.getLogger(__name__)


# Simple token_required decorator for government admin
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            # Decode the token
            data = jwt.decode(
                token, 
                Config.JWT_SECRET_KEY, 
                algorithms=[Config.JWT_ALGORITHM],
                options={'verify_exp': True}
            )
            
            # Get user from database
            query = "SELECT user_id, email, role FROM users WHERE user_id = %s"
            user = db.fetch_one(query, (data['user_id'],))
            
            if not user:
                return jsonify({'message': 'User not found'}), 401
            
            # Check if user is government admin
            if user['role'] != 'government_admin':
                return jsonify({'message': 'Insufficient permissions'}), 403
            
            return f(user, *args, **kwargs)
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
        except Exception as e:
            logger.error(f"Error processing token: {str(e)}")
            return jsonify({'message': 'Error processing token'}), 500
            
    return decorated

@government_admin_bp.route('/')
def government_admin_page():
    return render_template('government_admin.html')

@government_admin_bp.route('/dashboard/stats', methods=['GET'])
@token_required
def government_admin_dashboard_stats(current_user):
    """Return dashboard statistics for government admin."""
    try:
        total_employees = db.fetch_one("SELECT COUNT(*) as count FROM employees WHERE is_active = 1")['count']
        active_offices = db.fetch_one("SELECT COUNT(*) as count FROM offices")['count']
        pending_feedback = db.fetch_one("SELECT COUNT(*) as count FROM feedback WHERE status = 'pending'")['count']
        resolved_issues = db.fetch_one("SELECT COUNT(*) as count FROM feedback WHERE status = 'resolved'")['count']

        return jsonify({
            'success': True,
            'stats': {
                'totalEmployees': total_employees,
                'activeOffices': active_offices,
                'pendingFeedback': pending_feedback,
                'resolvedIssues': resolved_issues
            }
        })
    except Exception as e:
        logger.error(f"Error getting dashboard stats: {str(e)}")
        return jsonify({'success': False, 'message': 'Error getting dashboard statistics'}), 500

@government_admin_bp.route('/subcities', methods=['GET'])
@token_required
def get_subcities(current_user):
    """Get all subcities."""
    try:
        subcities = db.fetch_all("SELECT subcity_id, name, description FROM subcities ORDER BY name")
        return jsonify({'success': True, 'subcities': subcities})
    except Exception as e:
        logger.error(f"Error fetching subcities: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@government_admin_bp.route('/offices', methods=['GET'])
@token_required
def get_offices(current_user):
    """Get all offices, optionally filtered by subcity."""
    try:
        subcity_id = request.args.get('subcity_id')
        if subcity_id:
            offices = db.fetch_all(
                "SELECT office_id, office_name, office_desc, subcity_id FROM offices WHERE subcity_id = %s ORDER BY office_name",
                (subcity_id,)
            )
        else:
            offices = db.fetch_all("SELECT office_id, office_name, office_desc, subcity_id FROM offices ORDER BY office_name")
        return jsonify({'success': True, 'offices': offices})
    except Exception as e:
        logger.error(f"Error fetching offices: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@government_admin_bp.route('/employees', methods=['GET'])
@token_required
def get_employees(current_user):
    """Get all employees with optional subcity and office filters, matching the profile page logic."""
    try:
        subcity_id = request.args.get('subcity_id')
        office_id = request.args.get('office_id')
        query = """
            SELECT
                e.employee_id,
                e.full_name,
                e.position,
                e.photo_url,
                e.email,
                e.phone,
                e.is_active,
                e.created_at,
                e.updated_at,
                e.subcity_id,
                o.office_id,
                o.office_name AS office_name,
                s.subcity_id,
                s.name AS subcity_name
            FROM employees e
            JOIN offices o ON e.office_id = o.office_id
            JOIN subcities s ON e.subcity_id = s.subcity_id
            WHERE e.is_active = 1
        """
        params = []
        if subcity_id:
            query += " AND e.subcity_id = %s"
            params.append(subcity_id)
        if office_id:
            query += " AND e.office_id = %s"
            params.append(office_id)
        query += " ORDER BY s.name, o.office_name, e.full_name"
        employees = db.fetch_all(query, params)
        return jsonify({'success': True, 'employees': employees})
    except Exception as e:
        logger.error(f"Error fetching employees: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@government_admin_bp.route('/employees', methods=['POST'])
@token_required
def add_employee(current_user):
    """Add a new employee."""
    try:
        data = request.form
        photo = request.files.get('photo')
        
        # Validate required fields
        required_fields = ['employeeName', 'position', 'email', 'subcity_id', 'office_id', 'phone']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'{field} is required'}), 400

        # Handle photo upload
        photo_path = None
        if photo and allowed_file(photo.filename):
            filename = secure_filename(photo.filename)
            photo_path = os.path.join('uploads', filename)
            photo.save(photo_path)

        # Insert employee with subcity_id and phone
        query = """
            INSERT INTO employees (full_name, position, email, phone, office_id, subcity_id, photo_url)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        if db.execute(query, (data['employeeName'], data['position'], data['email'], data['phone'], data['office_id'], data['subcity_id'], photo_path)):
            return jsonify({'success': True, 'message': 'Employee added successfully'})
        return jsonify({'success': False, 'message': 'Error adding employee'}), 500
    except Exception as e:
        logger.error(f"Error adding employee: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@government_admin_bp.route('/employees/<int:employee_id>', methods=['GET'])
@token_required
def get_employee(current_user, employee_id):
    """Get a single employee by ID."""
    try:
        query = """
            SELECT e.*, o.office_name, s.name as subcity_name, s.subcity_id
            FROM employees e 
            JOIN offices o ON e.office_id = o.office_id 
            JOIN subcities s ON e.subcity_id = s.subcity_id 
            WHERE e.employee_id = %s
        """
        employee = db.fetch_one(query, (employee_id,))
        
        if not employee:
            return jsonify({'success': False, 'message': 'Employee not found'}), 404
        
        return jsonify({'success': True, 'employee': employee})
    except Exception as e:
        logger.error(f"Error fetching employee: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@government_admin_bp.route('/employees/<int:employee_id>', methods=['PUT'])
@token_required
def update_employee(current_user, employee_id):
    """Update employee details."""
    try:
        data = request.form
        photo = request.files.get('photo')
        
        # Handle photo upload
        photo_path = None
        if photo and allowed_file(photo.filename):
            filename = secure_filename(photo.filename)
            photo_path = os.path.join('uploads', filename)
            photo.save(photo_path)

        # Update employee with subcity_id
        query = """
            UPDATE employees 
            SET full_name = %s, position = %s, email = %s, office_id = %s, subcity_id = %s
            WHERE employee_id = %s
        """
        if db.execute(query, (data['employeeName'], data['position'], data['email'], data['office_id'], data['subcity_id'], employee_id)):
            if photo_path:
                db.execute("UPDATE employees SET photo_url = %s WHERE employee_id = %s", 
                         (photo_path, employee_id))
            return jsonify({'success': True, 'message': 'Employee updated successfully'})
        return jsonify({'success': False, 'message': 'Error updating employee'}), 500
    except Exception as e:
        logger.error(f"Error updating employee: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@government_admin_bp.route('/employees/<int:employee_id>', methods=['DELETE'])
@token_required
def delete_employee(current_user, employee_id):
    """Delete an employee."""
    try:
        if db.execute("DELETE FROM employees WHERE employee_id = %s", (employee_id,)):
            return jsonify({'success': True, 'message': 'Employee deleted successfully'})
        return jsonify({'success': False, 'message': 'Error deleting employee'}), 500
    except Exception as e:
        logger.error(f"Error deleting employee: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

def allowed_file(filename):
    """Check if the file extension is allowed."""
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@government_admin_bp.route('/feedback/<int:feedback_id>/respond', methods=['POST'])
@token_required
def respond_to_feedback(current_user, feedback_id):
    """Respond to a feedback and send the response via chat."""
    try:
        data = request.get_json()
        status = data.get('status')
        message = data.get('message')
        
        if not status or not message:
            return jsonify({'success': False, 'message': 'Status and message are required'}), 400
        
        # Get feedback details (to find user_id)
        feedback = db.fetch_one("SELECT user_id FROM feedback WHERE feedback_id = %s", (feedback_id,))
        if not feedback:
            return jsonify({'success': False, 'message': 'Feedback not found'}), 404

        user_id = feedback['user_id']
        admin_id = current_user['user_id']

        # Update feedback status, updated_at, and response
        db.execute(
            "UPDATE feedback SET status = %s, response = %s, updated_at = NOW() WHERE feedback_id = %s",
            (status, message, feedback_id)
        )

        # Only send chat message if user_id exists
        if user_id:
            # Find or create chat session
            session = db.fetch_one(
                "SELECT session_id FROM chat_session WHERE user_id = %s AND admin_id = %s AND status = 'active'",
                (user_id, admin_id)
            )
            if not session:
                # Create new session
                db.execute(
                    "INSERT INTO chat_session (user_id, admin_id, status, created_at, updated_at) VALUES (%s, %s, 'active', NOW(), NOW())",
                    (user_id, admin_id)
                )
                session_id = db.fetch_one(
                    "SELECT session_id FROM chat_session WHERE user_id = %s AND admin_id = %s AND status = 'active' ORDER BY created_at DESC LIMIT 1",
                    (user_id, admin_id)
                )['session_id']
            else:
                session_id = session['session_id']

            # Insert admin's response as a chat message
            db.execute(
                "INSERT INTO chat_message (session_id, sender_id, message, is_read, created_at) VALUES (%s, %s, %s, 0, NOW())",
                (session_id, admin_id, message)
            )

        return jsonify({'success': True, 'message': 'Response submitted.'})

    except Exception as e:
        logger.error(f"Error responding to feedback: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@government_admin_bp.route('/feedback', methods=['GET'])
@token_required
def get_feedbacks(current_user):
    """Get all feedbacks with user, office, and employee info for admin display."""
    try:
        query = '''
            SELECT
                f.feedback_id,
                f.user_id,
                f.office_id,
                f.employee_id,
                f.title,
                f.message,
                f.rating,
                f.status,
                f.created_at,
                f.updated_at,
                u.email AS user_email,
                o.office_name,
                e.full_name AS employee_name
            FROM feedback f
            LEFT JOIN users u ON f.user_id = u.user_id
            LEFT JOIN offices o ON f.office_id = o.office_id
            LEFT JOIN employees e ON f.employee_id = e.employee_id
            ORDER BY f.created_at DESC
        '''
        feedbacks = db.fetch_all(query)
        return jsonify({'success': True, 'feedbacks': feedbacks})
    except Exception as e:
        logger.error(f"Error fetching feedbacks: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500