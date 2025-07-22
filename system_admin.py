from flask import Blueprint, jsonify, request
from db import Database
from config import Config
import bcrypt
import jwt
from datetime import datetime, timedelta
from functools import wraps

system_admin_bp = Blueprint('system_admin', __name__)
db = Database()

# JWT token required decorator with role check
def token_required(roles=None):
    def decorator(f):
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
                
                # Check role if required
                if roles and user['role'] not in roles:
                    return jsonify({'message': 'Insufficient permissions'}), 403
                
                return f(user, *args, **kwargs)
                
            except jwt.ExpiredSignatureError:
                return jsonify({'message': 'Token has expired'}), 401
            except jwt.InvalidTokenError:
                return jsonify({'message': 'Invalid token!'}), 401
            except Exception as e:
                return jsonify({'message': 'Error processing token'}), 500
                
        return decorated
    return decorator

@system_admin_bp.route('/api/system-admin/dashboard/stats', methods=['GET'])
@token_required(['system_admin'])
def get_dashboard_stats(current_user):
    """Get dashboard statistics for system admin"""
    try:
        # Get total users count
        total_users_query = "SELECT COUNT(*) as count FROM users"
        total_users_result = db.fetch_one(total_users_query)
        total_users = total_users_result['count'] if total_users_result else 0
        
        # Get government admins count
        gov_admins_query = "SELECT COUNT(*) as count FROM users WHERE role = 'government_admin'"
        gov_admins_result = db.fetch_one(gov_admins_query)
        total_gov_admins = gov_admins_result['count'] if gov_admins_result else 0
        
        # Get regular users count
        regular_users_query = "SELECT COUNT(*) as count FROM users WHERE role = 'user'"
        regular_users_result = db.fetch_one(regular_users_query)
        total_regular_users = regular_users_result['count'] if regular_users_result else 0
        
        stats = {
            'total_users': total_users,
            'total_gov_admins': total_gov_admins,
            'total_regular_users': total_regular_users
        }
        
        return jsonify({
            'success': True,
            'stats': stats
        })
        
    except Exception as e:
        print(f"Error getting dashboard stats: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error retrieving dashboard statistics'
        }), 500

@system_admin_bp.route('/api/system-admin/dashboard/activity', methods=['GET'])
@token_required(['system_admin'])
def get_recent_activity(current_user):
    """Get recent activity for system admin dashboard"""
    try:
        # Get recent user registrations and activities
        activity_query = """
            SELECT 
                u.user_id,
                u.email as user_name,
                'User Registration' as action,
                u.created_at as timestamp
            FROM users u
            ORDER BY u.created_at DESC
            LIMIT 10
        """
        
        activities = db.fetch_all(activity_query)
        
        # Format the activities
        formatted_activities = []
        for activity in activities:
            formatted_activities.append({
                'user_name': activity['user_name'],
                'action': activity['action'],
                'timestamp': activity['timestamp'].isoformat() if activity['timestamp'] else None
            })
        
        return jsonify({
            'success': True,
            'activities': formatted_activities
        })
        
    except Exception as e:
        print(f"Error getting recent activity: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error retrieving recent activity'
        }), 500

@system_admin_bp.route('/api/system-admin/government-admins', methods=['GET'])
@token_required(['system_admin'])
def get_government_admins(current_user):
    """Get all government admins"""
    try:
        query = """
            SELECT user_id, email, full_name, created_at
            FROM users 
            WHERE role = 'government_admin'
            ORDER BY created_at DESC
        """
        
        admins = db.fetch_all(query)
        
        return jsonify({
            'success': True,
            'admins': admins
        })
        
    except Exception as e:
        print(f"Error getting government admins: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error retrieving government admins'
        }), 500

@system_admin_bp.route('/api/system-admin/government-admins', methods=['POST'])
@token_required(['system_admin'])
def create_government_admin(current_user):
    """Create a new government admin"""
    try:
        data = request.get_json()
        email = data.get('email')
        full_name = data.get('full_name')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({
                'success': False,
                'message': 'Email and password are required'
            }), 400
        
        # Check if user already exists
        existing_user = db.fetch_one("SELECT user_id FROM users WHERE email = %s", (email,))
        if existing_user:
            return jsonify({
                'success': False,
                'message': 'User with this email already exists'
            }), 400
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create government admin
        insert_query = """
            INSERT INTO users (email, password_hash, full_name, role) 
            VALUES (%s, %s, %s, 'government_admin')
        """
        
        if db.execute(insert_query, (email, hashed_password.decode('utf-8'), full_name)):
            return jsonify({
                'success': True,
                'message': 'Government admin created successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Error creating government admin'
            }), 500
            
    except Exception as e:
        print(f"Error creating government admin: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error creating government admin'
        }), 500

@system_admin_bp.route('/api/system-admin/government-admins/<int:user_id>', methods=['DELETE'])
@token_required(['system_admin'])
def delete_government_admin(current_user, user_id):
    """Delete a government admin"""
    try:
        # Check if user exists and is a government admin
        user = db.fetch_one(
            "SELECT user_id, role FROM users WHERE user_id = %s", 
            (user_id,)
        )
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        if user['role'] != 'government_admin':
            return jsonify({
                'success': False,
                'message': 'User is not a government admin'
            }), 400
        
        # Delete the user
        delete_query = "DELETE FROM users WHERE user_id = %s"
        if db.execute(delete_query, (user_id,)):
            return jsonify({
                'success': True,
                'message': 'Government admin deleted successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Error deleting government admin'
            }), 500
            
    except Exception as e:
        print(f"Error deleting government admin: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error deleting government admin'
        }), 500

@system_admin_bp.route('/api/system-admin/government-admins/<int:user_id>', methods=['GET'])
@token_required(['system_admin'])
def get_government_admin(current_user, user_id):
    """Get a specific government admin"""
    try:
        query = """
            SELECT user_id, email, full_name, created_at
            FROM users 
            WHERE user_id = %s AND role = 'government_admin'
        """
        
        admin = db.fetch_one(query, (user_id,))
        
        if not admin:
            return jsonify({
                'success': False,
                'message': 'Government admin not found'
            }), 404
        
        return jsonify({
            'success': True,
            'admin': admin
        })
        
    except Exception as e:
        print(f"Error getting government admin: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error retrieving government admin'
        }), 500

@system_admin_bp.route('/api/system-admin/government-admins/<int:user_id>', methods=['PUT'])
@token_required(['system_admin'])
def update_government_admin(current_user, user_id):
    """Update a government admin"""
    try:
        data = request.get_json()
        email = data.get('email')
        full_name = data.get('full_name')
        password = data.get('password')
        
        if not email or not full_name:
            return jsonify({
                'success': False,
                'message': 'Email and full name are required'
            }), 400
        
        # Check if user exists and is a government admin
        user = db.fetch_one(
            "SELECT user_id, role FROM users WHERE user_id = %s", 
            (user_id,)
        )
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        if user['role'] != 'government_admin':
            return jsonify({
                'success': False,
                'message': 'User is not a government admin'
            }), 400
        
        # Check if email is already taken by another user
        existing_user = db.fetch_one(
            "SELECT user_id FROM users WHERE email = %s AND user_id != %s", 
            (email, user_id)
        )
        if existing_user:
            return jsonify({
                'success': False,
                'message': 'Email is already taken by another user'
            }), 400
        
        # Update user
        if password:
            # Update with password
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            update_query = """
                UPDATE users 
                SET email = %s, full_name = %s, password_hash = %s, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = %s
            """
            success = db.execute(update_query, (email, full_name, hashed_password.decode('utf-8'), user_id))
        else:
            # Update without password
            update_query = """
                UPDATE users 
                SET email = %s, full_name = %s, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = %s
            """
            success = db.execute(update_query, (email, full_name, user_id))
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Government admin updated successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Error updating government admin'
            }), 500
            
    except Exception as e:
        print(f"Error updating government admin: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error updating government admin'
        }), 500

@system_admin_bp.route('/api/system-admin/users', methods=['GET'])
@token_required(['system_admin'])
def get_all_users(current_user):
    """Get all users"""
    try:
        query = """
            SELECT user_id, email, full_name, role, created_at
            FROM users 
            ORDER BY created_at DESC
        """
        
        users = db.fetch_all(query)
        
        return jsonify({
            'success': True,
            'users': users
        })
        
    except Exception as e:
        print(f"Error getting all users: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error retrieving users'
        }), 500

@system_admin_bp.route('/api/system-admin/users/<int:user_id>', methods=['DELETE'])
@token_required(['system_admin'])
def delete_user(current_user, user_id):
    """Delete a user"""
    try:
        # Check if user exists
        user = db.fetch_one("SELECT user_id, role FROM users WHERE user_id = %s", (user_id,))
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        # Delete the user
        delete_query = "DELETE FROM users WHERE user_id = %s"
        if db.execute(delete_query, (user_id,)):
            return jsonify({
                'success': True,
                'message': 'User deleted successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Error deleting user'
            }), 500
    except Exception as e:
        print(f"Error deleting user: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error deleting user'
        }), 500

@system_admin_bp.route('/api/system-admin/profile', methods=['GET'])
@token_required(['system_admin'])
def get_system_admin_profile(current_user):
    """Get system admin profile"""
    try:
        query = "SELECT user_id, email, full_name, role FROM users WHERE user_id = %s"
        user = db.fetch_one(query, (current_user['user_id'],))
        
        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404
        
        return jsonify({
            'success': True,
            'user': user
        })
    except Exception as e:
        print(f"Error getting system admin profile: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error retrieving profile'
        }), 500

@system_admin_bp.route('/api/system-admin/profile', methods=['PUT'])
@token_required(['system_admin'])
def update_system_admin_profile(current_user):
    """Update system admin profile"""
    try:
        data = request.get_json()
        email = data.get('email')
        full_name = data.get('full_name')
        
        if not email or not full_name:
            return jsonify({
                'success': False,
                'message': 'Email and full name are required'
            }), 400
        
        # Check if email is already taken by another user
        existing_user = db.fetch_one(
            "SELECT user_id FROM users WHERE email = %s AND user_id != %s", 
            (email, current_user['user_id'])
        )
        if existing_user:
            return jsonify({
                'success': False,
                'message': 'Email is already taken by another user'
            }), 400
        
        # Update user
        update_query = """
            UPDATE users 
            SET email = %s, full_name = %s, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = %s
        """
        if db.execute(update_query, (email, full_name, current_user['user_id'])):
            return jsonify({
                'success': True,
                'message': 'Profile updated successfully'
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Error updating profile'
            }), 500
    except Exception as e:
        print(f"Error updating system admin profile: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error updating profile'
        }), 500

@system_admin_bp.route('/api/system-admin/settings', methods=['GET'])
@token_required(['system_admin'])
def get_system_admin_settings(current_user):
    """Get system admin settings"""
    try:
        # For now, return default settings
        # In a real application, you would store these in a database
        settings = {
            'email_notifications': True,
            'system_notifications': True,
            'timezone': 'Africa/Addis_Ababa',
            'date_format': 'YYYY-MM-DD'
        }
        
        return jsonify({
            'success': True,
            'settings': settings
        })
    except Exception as e:
        print(f"Error getting system admin settings: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error retrieving settings'
        }), 500

@system_admin_bp.route('/api/system-admin/settings', methods=['PUT'])
@token_required(['system_admin'])
def update_system_admin_settings(current_user):
    """Update system admin settings"""
    try:
        data = request.get_json()
        email_notifications = data.get('email_notifications', True)
        system_notifications = data.get('system_notifications', True)
        timezone = data.get('timezone', 'Africa/Addis_Ababa')
        date_format = data.get('date_format', 'YYYY-MM-DD')
        
        # Update settings
        update_query = """
            UPDATE user_settings
            SET email_notifications = %s, system_notifications = %s, timezone = %s, date_format = %s
            WHERE user_id = %s
        """
        db.execute(update_query, (email_notifications, system_notifications, timezone, date_format, current_user['user_id']))
        
        return jsonify({
            'success': True,
            'message': 'Settings updated successfully'
        })
    except Exception as e:
        print(f"Error updating system admin settings: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error updating settings'
        }), 500