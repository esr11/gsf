from flask import Blueprint, request, jsonify
from db import Database
from datetime import datetime
from functools import wraps
import jwt
from config import Config

chat_api = Blueprint('chat_api', __name__)
db = Database()

# JWT token required decorator
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

@chat_api.route('/api/chat/sessions', methods=['POST'])
@token_required(['user', 'government_admin'])
def create_chat_session(current_user):
    """Create a new chat session"""
    try:
        print(f"[DEBUG] create_chat_session called by user {current_user['user_id']}")
        user_id = current_user['user_id']
        
        # Check if user already has an active session
        existing_session = db.fetch_one(
            "SELECT session_id FROM chat_sessions WHERE user_id = %s AND status = 'active'",
            (user_id,)
        )
        
        if existing_session:
            return jsonify({
                'message': 'Active session already exists',
                'session_id': existing_session['session_id']
            }), 200
        
        # Create new session
        query = """
            INSERT INTO chat_sessions (user_id, admin_id, status, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s)
        """
        
        # Find an available admin (government_admin role)
        admin = db.fetch_one(
            "SELECT user_id FROM users WHERE role = 'government_admin' LIMIT 1"
        )
        admin_id = admin['user_id'] if admin else None
        
        session_data = (
            user_id,
            admin_id,
            'active',
            datetime.now(),
            datetime.now()
        )
        
        if db.execute(query, session_data):
            # Commit the transaction
            db.commit()
            # Get the created session
            session = db.fetch_one(
                "SELECT * FROM chat_sessions WHERE user_id = %s AND status = 'active'",
                (user_id,)
            )
            
            return jsonify({
                'message': 'Chat session created successfully',
                'session': {
                    'session_id': session['session_id'],
                    'user_id': session['user_id'],
                    'admin_id': session['admin_id'],
                    'status': session['status'],
                    'created_at': session['created_at'].isoformat() if session['created_at'] else None
                }
            }), 201
        else:
            return jsonify({'message': 'Failed to create chat session'}), 500
            
    except Exception as e:
        print(f"Error creating chat session: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@chat_api.route('/api/chat/sessions/<int:session_id>/close', methods=['PUT'])
@token_required(['user', 'government_admin'])
def close_chat_session(current_user, session_id):
    """Close a chat session"""
    try:
        user_id = current_user['user_id']
        
        # Check if session exists and belongs to user
        session = db.fetch_one(
            "SELECT * FROM chat_sessions WHERE session_id = %s AND user_id = %s",
            (session_id, user_id)
        )
        
        if not session:
            return jsonify({'message': 'Session not found'}), 404
        
        # Close the session
        query = """
            UPDATE chat_sessions 
            SET status = 'closed', updated_at = %s 
            WHERE session_id = %s
        """
        
        if db.execute(query, (datetime.now(), session_id)):
            # Commit the transaction
            db.commit()
            return jsonify({'message': 'Chat session closed successfully'}), 200
        else:
            return jsonify({'message': 'Failed to close chat session'}), 500
            
    except Exception as e:
        print(f"Error closing chat session: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@chat_api.route('/api/chat/sessions', methods=['GET'])
@token_required(['user', 'government_admin'])
def get_user_sessions(current_user):
    """Get all chat sessions for the current user"""
    try:
        user_id = current_user['user_id']
        
        query = """
            SELECT cs.*, 
                   u1.email as user_email, u1.full_name as user_name,
                   u2.email as admin_email, u2.full_name as admin_name
            FROM chat_sessions cs
            LEFT JOIN users u1 ON cs.user_id = u1.user_id
            LEFT JOIN users u2 ON cs.admin_id = u2.user_id
            WHERE cs.user_id = %s
            ORDER BY cs.created_at DESC
        """
        
        sessions = db.fetch_all(query, (user_id,))
        
        # Format sessions
        formatted_sessions = []
        for session in sessions:
            formatted_sessions.append({
                'session_id': session['session_id'],
                'user_id': session['user_id'],
                'admin_id': session['admin_id'],
                'status': session['status'],
                'created_at': session['created_at'].isoformat() if session['created_at'] else None,
                'updated_at': session['updated_at'].isoformat() if session['updated_at'] else None,
                'user_email': session['user_email'],
                'user_name': session['user_name'],
                'admin_email': session['admin_email'],
                'admin_name': session['admin_name']
            })
        
        return jsonify({
            'sessions': formatted_sessions
        }), 200
        
    except Exception as e:
        print(f"Error getting user sessions: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@chat_api.route('/api/chat/messages', methods=['POST'])
@token_required(['user', 'government_admin'])
def send_message(current_user):
    """Send a message in a chat session"""
    try:
        print(f"[DEBUG] send_message called by user {current_user['user_id']}")
        data = request.get_json()
        print(f"[DEBUG] Request data: {data}")
        
        sender_id = current_user['user_id']
        session_id = data.get('session_id')
        message_text = data.get('message')
        
        print(f"[DEBUG] sender_id: {sender_id}, session_id: {session_id}, message: {message_text}")
        
        if not session_id or not message_text:
            print(f"[DEBUG] Missing required fields: session_id={session_id}, message={message_text}")
            return jsonify({'message': 'Session ID and message are required'}), 400
        
        # Check if session exists and is active
        session = db.fetch_one(
            "SELECT * FROM chat_sessions WHERE session_id = %s AND status = 'active'",
            (session_id,)
        )
        
        print(f"[DEBUG] Session lookup result: {session}")
        
        if not session:
            print(f"[DEBUG] Active session not found for session_id: {session_id}")
            return jsonify({'message': 'Active session not found'}), 404
        
        # Check if user is part of this session
        if session['user_id'] != sender_id and session['admin_id'] != sender_id:
            print(f"[DEBUG] Access denied: user {sender_id} not in session {session_id}")
            return jsonify({'message': 'Access denied'}), 403
        
        # Insert message
        query = """
            INSERT INTO chat_messages (session_id, sender_id, message, is_read, created_at)
            VALUES (%s, %s, %s, %s, %s)
        """
        
        message_data = (
            session_id,
            sender_id,
            message_text,
            False,  # Not read initially
            datetime.now()
        )
        
        print(f"[DEBUG] Executing message insert with data: {message_data}")
        
        if db.execute(query, message_data):
            # Commit the transaction
            db.commit()
            print(f"[DEBUG] Message inserted successfully")
            # Get the created message
            created_message = db.fetch_one(
                "SELECT * FROM chat_messages WHERE session_id = %s AND sender_id = %s ORDER BY created_at DESC LIMIT 1",
                (session_id, sender_id)
            )
            
            print(f"[DEBUG] Created message: {created_message}")
            
            return jsonify({
                'message': 'Message sent successfully',
                'chat_message': {
                    'message_id': created_message['message_id'],
                    'session_id': created_message['session_id'],
                    'sender_id': created_message['sender_id'],
                    'message': created_message['message'],
                    'is_read': created_message['is_read'],
                    'created_at': created_message['created_at'].isoformat() if created_message['created_at'] else None
                }
            }), 201
        else:
            print(f"[DEBUG] Failed to insert message")
            return jsonify({'message': 'Failed to send message'}), 500
            
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@chat_api.route('/api/chat/messages/<int:session_id>', methods=['GET'])
@token_required(['user', 'government_admin'])
def get_messages(current_user, session_id):
    """Get all messages for a specific chat session"""
    try:
        user_id = current_user['user_id']
        
        # Check if session exists and user has access
        session = db.fetch_one(
            "SELECT * FROM chat_sessions WHERE session_id = %s AND (user_id = %s OR admin_id = %s)",
            (session_id, user_id, user_id)
        )
        
        if not session:
            return jsonify({'message': 'Session not found'}), 404
        
        # Get messages
        query = """
            SELECT cm.*, u.email as sender_email, u.full_name as sender_name
            FROM chat_messages cm
            LEFT JOIN users u ON cm.sender_id = u.user_id
            WHERE cm.session_id = %s
            ORDER BY cm.created_at ASC
        """
        
        messages = db.fetch_all(query, (session_id,))
        
        # Mark messages as read if they're not from the current user
        mark_read_query = """
            UPDATE chat_messages 
            SET is_read = TRUE 
            WHERE session_id = %s AND sender_id != %s AND is_read = FALSE
        """
        if db.execute(mark_read_query, (session_id, user_id)):
            db.commit()
        
        # Format messages
        formatted_messages = []
        for msg in messages:
            formatted_messages.append({
                'message_id': msg['message_id'],
                'session_id': msg['session_id'],
                'sender_id': msg['sender_id'],
                'message': msg['message'],
                'is_read': msg['is_read'],
                'created_at': msg['created_at'].isoformat() if msg['created_at'] else None,
                'sender_email': msg['sender_email'],
                'sender_name': msg['sender_name'],
                'is_sent_by_me': msg['sender_id'] == user_id
            })
        
        return jsonify({
            'session_id': session_id,
            'messages': formatted_messages
        }), 200
        
    except Exception as e:
        print(f"Error getting messages: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@chat_api.route('/api/chat/messages/<int:message_id>/read', methods=['PUT'])
@token_required(['user', 'government_admin'])
def mark_message_read(current_user, message_id):
    """Mark a specific message as read"""
    try:
        user_id = current_user['user_id']
        
        # Check if message exists and user has access
        message = db.fetch_one(
            """
            SELECT cm.* FROM chat_messages cm
            JOIN chat_sessions cs ON cm.session_id = cs.session_id
            WHERE cm.message_id = %s AND (cs.user_id = %s OR cs.admin_id = %s)
            """,
            (message_id, user_id, user_id)
        )
        
        if not message:
            return jsonify({'message': 'Message not found'}), 404
        
        # Mark as read
        query = "UPDATE chat_messages SET is_read = TRUE WHERE message_id = %s"
        
        if db.execute(query, (message_id,)):
            # Commit the transaction
            db.commit()
            return jsonify({'message': 'Message marked as read'}), 200
        else:
            return jsonify({'message': 'Failed to mark message as read'}), 500
            
    except Exception as e:
        print(f"Error marking message as read: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@chat_api.route('/api/chat/unread-count', methods=['GET'])
@token_required(['user', 'government_admin'])
def get_unread_count(current_user):
    """Get count of unread messages for the current user"""
    try:
        user_id = current_user['user_id']
        
        query = """
            SELECT COUNT(*) as unread_count
            FROM chat_messages cm
            JOIN chat_sessions cs ON cm.session_id = cs.session_id
            WHERE (cs.user_id = %s OR cs.admin_id = %s) 
            AND cm.sender_id != %s 
            AND cm.is_read = FALSE
        """
        
        result = db.fetch_one(query, (user_id, user_id, user_id))
        
        return jsonify({
            'unread_count': result['unread_count'] if result else 0
        }), 200
        
    except Exception as e:
        print(f"Error getting unread count: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@chat_api.route('/api/chat/admin/sessions', methods=['GET'])
@token_required(['government_admin'])
def get_admin_sessions(current_user):
    """Get all chat sessions for government admin"""
    try:
        admin_id = current_user['user_id']
        
        query = """
            SELECT cs.*, 
                   u1.email as user_email, u1.full_name as user_name,
                   u2.email as admin_email, u2.full_name as admin_name,
                   (SELECT COUNT(*) FROM chat_messages cm WHERE cm.session_id = cs.session_id AND cm.sender_id != %s AND cm.is_read = FALSE) as unread_count
            FROM chat_sessions cs
            LEFT JOIN users u1 ON cs.user_id = u1.user_id
            LEFT JOIN users u2 ON cs.admin_id = u2.user_id
            WHERE cs.admin_id = %s
            ORDER BY cs.updated_at DESC
        """
        
        sessions = db.fetch_all(query, (admin_id, admin_id))
        
        # Format sessions
        formatted_sessions = []
        for session in sessions:
            formatted_sessions.append({
                'session_id': session['session_id'],
                'user_id': session['user_id'],
                'admin_id': session['admin_id'],
                'status': session['status'],
                'created_at': session['created_at'].isoformat() if session['created_at'] else None,
                'updated_at': session['updated_at'].isoformat() if session['updated_at'] else None,
                'user_email': session['user_email'],
                'user_name': session['user_name'],
                'admin_email': session['admin_email'],
                'admin_name': session['admin_name'],
                'unread_count': session['unread_count']
            })
        
        return jsonify({
            'sessions': formatted_sessions
        }), 200
        
    except Exception as e:
        print(f"Error getting admin sessions: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@chat_api.route('/api/chat/admin/assign-session/<int:session_id>', methods=['PUT'])
@token_required(['government_admin'])
def assign_session_to_admin(current_user, session_id):
    """Assign a chat session to a specific admin"""
    try:
        admin_id = current_user['user_id']
        
        # Check if session exists and is not already assigned
        session = db.fetch_one(
            "SELECT * FROM chat_sessions WHERE session_id = %s AND admin_id IS NULL",
            (session_id,)
        )
        
        if not session:
            return jsonify({'message': 'Session not found or already assigned'}), 404
        
        # Assign session to admin
        query = """
            UPDATE chat_sessions 
            SET admin_id = %s, updated_at = %s 
            WHERE session_id = %s
        """
        
        if db.execute(query, (admin_id, datetime.now(), session_id)):
            # Commit the transaction
            db.commit()
            return jsonify({'message': 'Session assigned successfully'}), 200
        else:
            return jsonify({'message': 'Failed to assign session'}), 500
            
    except Exception as e:
        print(f"Error assigning session: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500 