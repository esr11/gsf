from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from db import Database                      # ← import the Database class
from config import Config
import bcrypt, jwt, random, string, os
from datetime import datetime, timedelta
from functools import wraps
from government_admin import government_admin_bp
from system_admin      import system_admin_bp
from office            import office_bp
from email_utils       import send_verification_email
from profile_api import profile_api
from feedback_api import feedback_api
from chat_api import chat_api

app = Flask(__name__, static_folder='.', static_url_path='')


# --- CORS (includes Authorization header) -------------------------------
# --- CORS (includes Authorization header) -------------------------------
CORS(
    app,
    resources={r"/api/*": {"origins": [
        "http://localhost:5000",
        "http://127.0.0.1:5000"
    ]}},
    expose_headers=["Authorization"],
    allow_headers =["Content-Type", "Authorization"]
)

# --- SINGLETON DB INSTANCE ----------------------------------------------
db = Database()  # db is now a globally‑available Database instance
# in‑memory 6‑digit codes (use Redis in prod)
verification_codes = {}

app.config['SECRET_KEY'] = Config.JWT_SECRET_KEY

# ------------------------------------------------------------------------
#  Blueprints
# ------------------------------------------------------------------------
app.register_blueprint(office_bp)
app.register_blueprint(system_admin_bp)
app.register_blueprint(profile_api)
app.register_blueprint(feedback_api)
app.register_blueprint(chat_api)
app.register_blueprint(government_admin_bp, url_prefix='/api/government-admin')
# (all remaining routes are unchanged)
# ...
# JWT token required decorator with role check
def token_required(roles=None):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            token = request.headers.get('Authorization')
            print(f"[DEBUG] Received Authorization header: {token}")  # Debug log
            
            if not token:
                print("[DEBUG] No token provided")  # Debug log
                return jsonify({'message': 'Token is missing'}), 401
            
            try:
                # Remove 'Bearer ' prefix if present
                if token.startswith('Bearer '):
                    token = token[7:]
                print(f"[DEBUG] Raw token: {token}")
                
                # Decode the token
                data = jwt.decode(
                    token, 
                    app.config['SECRET_KEY'], 
                    algorithms=[Config.JWT_ALGORITHM],
                    options={'verify_exp': True}
                )
                print(f"[DEBUG] Decoded token data: {data}")  # Debug log
                
                # Get user from database
                query = "SELECT user_id, email, role FROM users WHERE user_id = %s"
                user = db.fetch_one(query, (data['user_id'],))
                print(f"[DEBUG] User from DB: {user}")
                
                if not user:
                    print("[DEBUG] User not found in database")  # Debug log
                    return jsonify({'message': 'User not found'}), 401
                
                # Check role if required
                if roles and user['role'] not in roles:
                    print(f"[DEBUG] User role {user['role']} not in required roles {roles}")  # Debug log
                    return jsonify({'message': 'Insufficient permissions'}), 403
                
                return f(user, *args, **kwargs)
                
            except jwt.ExpiredSignatureError:
                print("[DEBUG] Token has expired")  # Debug log
                return jsonify({'message': 'Token has expired'}), 401
            except jwt.InvalidTokenError as e:
                print(f"[DEBUG] Invalid token: {str(e)}")  # Debug log
                return jsonify({'message': 'Invalid token!'}), 401
            except Exception as e:
                print(f"[DEBUG] Error processing token: {str(e)}")  # Debug log
                return jsonify({'message': 'Error processing token'}), 500
                
        return decorated
    return decorator
# Generate verification code
def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))
# Routes
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)
@app.route('/api/check-email', methods=['POST'])
def check_email():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'message': 'Email is required'}), 400
    
    # Check if user exists
    user = db.fetch_one("SELECT * FROM users WHERE email = %s", (email,))
    return jsonify({'exists': user is not None})
@app.route('/api/send-verification', methods=['POST'])
def send_verification():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'message': 'Email is required'}), 400
    
    # Generate verification code
    code = generate_verification_code()
    
    # Store the code
    verification_codes[email] = {
        'code': code,
        'expires': datetime.now() + timedelta(minutes=10)
    }
    
    # Send the code via email
    if send_verification_email(email, code):
        return jsonify({'message': 'Verification code sent successfully'})
    else:
        return jsonify({'message': 'Failed to send verification code'}), 500
@app.route('/api/verify-code', methods=['POST'])
def verify_code():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')
    
    if not email or not code:
        return jsonify({'message': 'Email and code are required'}), 400
    
    # Check if code exists and is valid
    stored_data = verification_codes.get(email)
    if not stored_data or stored_data['code'] != code:
        return jsonify({'message': 'Invalid verification code'}), 400
    
    if datetime.now() > stored_data['expires']:
        del verification_codes[email]
        return jsonify({'message': 'Verification code expired'}), 400
    
    # Code is valid, remove it
    del verification_codes[email]
    return jsonify({'message': 'Code verified successfully'})
@app.route('/api/setup-password', methods=['POST'])
def setup_password():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400
    
    # Hash password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    # Create user
    query = "INSERT INTO users (email, password_hash) VALUES (%s, %s)"
    if db.execute(query, (email, hashed_password.decode('utf-8'))):
        return jsonify({'message': 'Password set successfully'}), 201
    return jsonify({'message': 'Error setting password'}), 500
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        # Get user from database
        user = db.fetch_one("SELECT * FROM users WHERE email = %s", (email,))
        
        if not user:
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': user['user_id'],
            'email': user['email'],
            'role': user['role'],
            'exp': datetime.utcnow() + timedelta(days=1)
        }, app.config['SECRET_KEY'], algorithm=Config.JWT_ALGORITHM)
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': token,
            'user': {
                'email': user['email'],
                'role': user['role']
            }
        })
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'message': 'An error occurred during login'}), 500
@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        try:
            # Check if user already exists
            existing_user = db.fetch_one("SELECT user_id FROM users WHERE email = %s", (email,))
            if existing_user:
                return jsonify({'message': 'User already exists'}), 400
            
            # Hash password
            try:
                hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
                hashed_password_str = hashed_password.decode('utf-8')
                print(f"Generated hash: {hashed_password_str}")  # Debug log
            except Exception as e:
                print(f"Password hashing error: {str(e)}")  # Debug log
                return jsonify({'message': 'Error processing password'}), 500
            
            # Create user
            query = "INSERT INTO users (email, password_hash, role) VALUES (%s, %s, %s)"
            if db.execute(query, (email, hashed_password_str, 'user')):
                return jsonify({
                    'message': 'User registered successfully',
                    'redirect': '/login.html'  # Add redirect URL
                }), 201
            return jsonify({'message': 'Error creating user'}), 500
        except Exception as e:
            print(f"Signup error: {str(e)}")  # Debug log
            return jsonify({'message': 'An error occurred during signup'}), 500
    except Exception as e:
        print(f"Signup error: {str(e)}")
        return jsonify({'message': f'An error occurred during signup: {str(e)}'}), 500
# ✅ NEW ENDPOINT: Fetch subcities from database
@app.route('/api/subcities', methods=['GET'])
def get_subcities():
    """
    Endpoint to fetch all subcities from the database
    """
    try:
        # Query to fetch all subcities from the database
        query = "SELECT subcity_id, name, description FROM subcities ORDER BY name"
        subcities = db.fetch_all(query)
        
        return jsonify({
            'success': True,
            'subcities': subcities
        })
        
    except Exception as e:
        print(f"Error fetching subcities: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error fetching subcities from database'
        }), 500

@app.route('/api/subcities/<int:subcity_id>/offices', methods=['GET'])
def get_offices_by_subcity(subcity_id):
    """
    Endpoint to fetch offices for a specific subcity
    """
    try:
        query = "SELECT office_id, office_name, office_desc, subcity_id FROM offices WHERE subcity_id = %s ORDER BY office_name"
        offices = db.fetch_all(query, (subcity_id,))
        
        return jsonify({
            'success': True,
            'offices': offices
        })
        
    except Exception as e:
        print(f"Error fetching offices for subcity {subcity_id}: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'Error fetching offices from database'
        }), 500
@app.route('/api/feedback', methods=['POST'])
def submit_feedback():
    try:
        data = request.get_json()
        print(f"Received feedback data: {data}")  # Debug log
        
        # Validate required fields
        required_fields = ['employee_id', 'office_id', 'title', 'message', 'rating', 'user_name', 'user_email']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'message': f'Missing required field: {field}'}), 400
        
        # Insert feedback into database
        query = """
        INSERT INTO feedback (user_id, office_id, employee_id, title, message, rating, status, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
        """
        
        # For now, user_id is null (anonymous feedback)
        # You can modify this to use actual user authentication later
        params = (
            None,  # user_id (null for anonymous)
            data['office_id'],
            data['employee_id'],
            data['title'],
            data['message'],
            data['rating'],
            'pending'  # default status
        )
        
        print(f"Executing query with params: {params}")  # Debug log
        
        if db.execute(query, params):
            print("Feedback inserted successfully")  # Debug log
            return jsonify({
                'success': True,
                'message': 'Feedback submitted successfully'
            }), 201
        else:
            print("Database execute returned False")  # Debug log
            return jsonify({'message': 'Error submitting feedback'}), 500
            
    except Exception as e:
        print(f"Error submitting feedback: {str(e)}")
        return jsonify({'message': f'Error submitting feedback: {str(e)}'}), 500

@app.route('/api/employees', methods=['GET'])
def get_all_employees():
    try:
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
        ORDER BY e.full_name
        """
        
        employees = db.fetch_all(query)
        
        return jsonify({
            'success': True,
            'employees': employees
        })
        
    except Exception as e:
        print(f"Error getting employees: {str(e)}")
        return jsonify({'message': 'Error getting employees'}), 500

@app.route('/api/employees/<int:employee_id>', methods=['GET'])
def get_employee(employee_id):
    try:
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
        WHERE e.employee_id = %s AND e.is_active = 1
        """
        
        employee = db.fetch_one(query, (employee_id,))
        
        if not employee:
            return jsonify({'message': 'Employee not found'}), 404
        
        return jsonify({
            'success': True,
            'employee': employee
        })
        
    except Exception as e:
        print(f"Error getting employee: {str(e)}")
        return jsonify({'message': 'Error getting employee details'}), 500






@app.route('/api/test-db', methods=['GET'])
def test_db():
    try:
        # Test database connection
        db.fetch_one("SELECT 1")
        return jsonify({'message': 'Database connection successful'}), 200
    except Exception as e:
        print(f"Database test error: {str(e)}")
        return jsonify({'message': 'An error occurred during database test'}), 500
@app.route('/api/db', methods=['POST'])
@token_required(['system_admin', 'government_admin'])  # Allow both system and government admins
def execute_db_query(current_user):
    try:
        data = request.get_json()
        if not data or 'sql' not in data:
            return jsonify({'error': 'SQL query is required'}), 400
        sql = data['sql']
        params = data.get('params', [])
        # Log the query for debugging
        print(f"Executing query: {sql}")
        print(f"With params: {params}")
        # Execute the query
        if sql.strip().upper().startswith('SELECT'):
            # For SELECT queries, return the results
            results = db.fetch_all(sql, params)
            return jsonify(results)
        else:
            # For other queries (INSERT, UPDATE, DELETE), execute and return success
            try:
                success = db.execute(sql, params)
                if success:
                    return jsonify({'message': 'Query executed successfully'})
                return jsonify({'error': 'Query execution failed'}), 500
            except Exception as e:
                print(f"Query execution error: {str(e)}")
                return jsonify({'error': f'Query execution failed: {str(e)}'}), 500
    except Exception as e:
        print(f"Database query error: {str(e)}")
        return jsonify({'error': str(e)}), 500
# Register blueprints
# System Admin Dashboard Endpoints
@app.route('/api/system-admin/dashboard/stats', methods=['GET'])
@token_required(['system_admin'])
def get_dashboard_stats(current_user):
    try:
        # Get total users count
        total_users = db.fetch_one("SELECT COUNT(*) as count FROM users")['count']
        
        # Get government admins count
        gov_admins = db.fetch_one("SELECT COUNT(*) as count FROM users WHERE role = 'government_admin'")['count']
        
        # Get regular users count
        regular_users = db.fetch_one("SELECT COUNT(*) as count FROM users WHERE role = 'user'")['count']
        
        return jsonify({
            'success': True,
            'stats': {
                'total_users': total_users,
                'total_gov_admins': gov_admins,
                'total_regular_users': regular_users
            }
        })
    except Exception as e:
        print(f"Error getting dashboard stats: {str(e)}")
        return jsonify({'message': 'Error getting dashboard statistics'}), 500
@app.route('/api/system-admin/dashboard/activity', methods=['GET'])
@token_required(['system_admin'])
def get_recent_activity(current_user):
    try:
        # Get recent user activity
        query = """
            SELECT u.full_name as user_name, ua.action, ua.timestamp
            FROM user_activity ua
            JOIN users u ON ua.user_id = u.user_id
            ORDER BY ua.timestamp DESC
            LIMIT 10
        """
        activities = db.fetch_all(query)
        
        return jsonify({
            'success': True,
            'activities': activities
        })
    except Exception as e:
        print(f"Error getting recent activity: {str(e)}")
        return jsonify({'message': 'Error getting recent activity'}), 500
@app.route('/api/system-admin/government-admins', methods=['GET'])
@token_required(['system_admin'])
def get_government_admins(current_user):
    try:
        # Fetch government admins from database
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
        print(f"Error fetching government admins: {str(e)}")
        return jsonify({'message': 'Error fetching government admins'}), 500
@app.route('/api/system-admin/government-admins', methods=['POST'])
@token_required(['system_admin'])
def add_government_admin(current_user):
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name')
        
        if not email or not password or not full_name:
            return jsonify({'message': 'Email, password, and full name are required'}), 400
        
        # Reset any existing transaction state
        db.reset_transaction()
        
        try:
            # Check if email already exists
            existing_user = db.fetch_one("SELECT user_id FROM users WHERE email = %s", (email,))
            if existing_user:
                return jsonify({'message': 'Email already exists'}), 400
            
            # Hash password
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            
            # Insert new government admin
            query = """
                INSERT INTO users (email, password_hash, full_name, role, created_at) 
                VALUES (%s, %s, %s, 'government_admin', NOW())
            """
            if db.execute(query, (email, hashed_password.decode('utf-8'), full_name)):
                # Commit the transaction
                if db.commit():
                    return jsonify({
                        'success': True,
                        'message': 'Government admin created successfully'
                    })
                else:
                    db.rollback()
                    return jsonify({'message': 'Error committing transaction'}), 500
            else:
                db.rollback()
                return jsonify({'message': 'Error creating government admin'}), 500
                
        except Exception as e:
            # Rollback on any error
            db.rollback()
            print(f"Error in transaction: {str(e)}")
            return jsonify({'message': f'Error creating government admin: {str(e)}'}), 500
            
    except Exception as e:
        print(f"Error creating government admin: {str(e)}")
        return jsonify({'message': f'Error creating government admin: {str(e)}'}), 500
@app.route('/api/system-admin/government-admins/<int:user_id>', methods=['DELETE'])
@token_required(['system_admin'])
def delete_government_admin(current_user, user_id):
    try:
        # Reset any existing transaction state
        db.reset_transaction()
        
        # Check if user exists and is a government admin
        user = db.fetch_one("SELECT role FROM users WHERE user_id = %s", (user_id,))
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        if user['role'] != 'government_admin':
            return jsonify({'message': 'User is not a government admin'}), 400
        
        try:
            # Start transaction
            db.connection.start_transaction()
            
            # Delete related records first
            # Delete user settings
            db.execute("DELETE FROM user_settings WHERE user_id = %s", (user_id,))
            
            # Delete user activity
            db.execute("DELETE FROM user_activity WHERE user_id = %s", (user_id,))
            
            # Delete feedback
            db.execute("DELETE FROM feedback WHERE user_id = %s", (user_id,))
            
            # Finally delete the user
            db.execute("DELETE FROM users WHERE user_id = %s AND role = 'government_admin'", (user_id,))
            
            # Commit the transaction
            db.connection.commit()
            
            return jsonify({
                'success': True,
                'message': 'Government admin deleted successfully'
            })
                
        except Exception as e:
            # Rollback on any error
            db.connection.rollback()
            print(f"Error in transaction: {str(e)}")
            return jsonify({'message': f'Error deleting government admin: {str(e)}'}), 500
            
    except Exception as e:
        print(f"Error deleting government admin: {str(e)}")
        return jsonify({'message': f'Error deleting government admin: {str(e)}'}), 500
@app.route('/api/system-admin/government-admins/<int:user_id>', methods=['GET'])
@token_required(['system_admin'])
def get_government_admin(user_id, current_user):
    try:
        # Get government admin details
        query = """
            SELECT user_id, email, full_name, role 
            FROM users 
            WHERE user_id = %s AND role = 'government_admin'
        """
        admin = db.fetch_one(query, (user_id,))
        
        if not admin:
            return jsonify({'message': 'Government admin not found'}), 404
        
        return jsonify({
            'success': True,
            'admin': admin
        })
    except Exception as e:
        print(f"Error getting government admin: {str(e)}")
        return jsonify({'message': 'Error getting government admin'}), 500
@app.route('/api/system-admin/government-admins/<int:user_id>', methods=['PUT'])
@token_required(['system_admin'])
def update_government_admin(user_id, current_user):
    try:
        data = request.get_json()
        email = data.get('email')
        full_name = data.get('full_name')
        password = data.get('password')
        
        if not email or not full_name:
            return jsonify({'message': 'Email and full name are required'}), 400
        
        # Check if user exists and is a government admin
        user = db.fetch_one("SELECT role FROM users WHERE user_id = %s", (user_id,))
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        if user['role'] != 'government_admin':
            return jsonify({'message': 'User is not a government admin'}), 400
        
        # Check if email is already taken by another user
        existing_user = db.fetch_one(
            "SELECT user_id FROM users WHERE email = %s AND user_id != %s", 
            (email, user_id)
        )
        if existing_user:
            return jsonify({'message': 'Email already exists'}), 400
        
        # Prepare update query
        if password:
            # Update with new password
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            query = """
                UPDATE users 
                SET email = %s, full_name = %s, password_hash = %s 
                WHERE user_id = %s AND role = 'government_admin'
            """
            params = (email, full_name, hashed_password.decode('utf-8'), user_id)
        else:
            # Update without changing password
            query = """
                UPDATE users 
                SET email = %s, full_name = %s 
                WHERE user_id = %s AND role = 'government_admin'
            """
            params = (email, full_name, user_id)
        
        if db.execute(query, params):
            return jsonify({
                'success': True,
                'message': 'Government admin updated successfully'
            })
        else:
            return jsonify({'message': 'Error updating government admin'}), 500
            
    except Exception as e:
        print(f"Error updating government admin: {str(e)}")
        return jsonify({'message': 'Error updating government admin'}), 500
@app.route('/api/users', methods=['GET'])
def get_all_users():
    return jsonify({
        'success': True,
        'users': [
            {
                'user_id': 1,
                'email': 'user1@example.com',
                'role': 'user',
                'created_at': datetime.now().isoformat()
            },
            {
                'user_id': 2,
                'email': 'user2@example.com',
                'role': 'admin',
                'created_at': datetime.now().isoformat()
            }
        ]
    })
@app.route('/api/system-admin/profile', methods=['GET'])
@token_required(['system_admin'])
def get_system_admin_profile(current_user):
    try:
        return jsonify({
            'success': True,
            'user': {
                'email': current_user['email'],
                'role': current_user['role']
            }
        })
    except Exception as e:
        print(f"Error getting system admin profile: {str(e)}")
        return jsonify({'message': 'Error getting profile'}), 500
@app.route('/api/system-admin/settings', methods=['GET'])
@token_required(['system_admin'])
def get_system_admin_settings(current_user):
    try:
        # Get user settings from database
        query = "SELECT * FROM user_settings WHERE user_id = %s"
        settings = db.fetch_one(query, (current_user['user_id'],))
        
        if not settings:
            # Return default settings if none exist
            settings = {
                'email_notifications': True,
                'system_notifications': True,
                'timezone': 'UTC',
                'date_format': 'YYYY-MM-DD'
            }
        
        return jsonify({
            'success': True,
            'settings': settings
        })
    except Exception as e:
        print(f"Error getting system admin settings: {str(e)}")
        return jsonify({'message': 'Error getting settings'}), 500
# Add favicon route
@app.route('/favicon.ico')
def favicon():
    return send_from_directory('.', 'favicon.ico', mimetype='image/vnd.microsoft.icon')
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)