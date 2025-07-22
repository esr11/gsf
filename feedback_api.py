from flask import Blueprint, request, jsonify
from db import Database  # Make sure this matches your db utility

feedback_api = Blueprint('feedback_api', __name__)
db = Database()

@feedback_api.route('/api/feedback', methods=['POST'])
def submit_feedback():
    data = request.get_json()
    print(f"Feedback API: Received data: {data}")  # Debug log
    
    required_fields = ['employee_id', 'office_id', 'title', 'message', 'rating', 'user_name', 'user_email']
    for field in required_fields:
        if not data.get(field):
            print(f"Feedback API: Missing field: {field}")  # Debug log
            return jsonify({'success': False, 'message': f'Missing required field: {field}'}), 400

    query = """
        INSERT INTO feedback (user_id, office_id, employee_id, title, message, rating, status, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, NOW(), NOW())
    """
    params = (
        None,
        data['office_id'],
        data['employee_id'],
        data['title'],
        data['message'],
        data['rating'],
        'pending'
    )
    print(f"Feedback API: Executing query with params: {params}")  # Debug log
    
    try:
        print("Feedback API: Executing database query...")  # Debug log
        if db.execute(query, params):
            print("Feedback API: Query executed successfully, committing...")  # Debug log
            # Commit the transaction to save the data
            if db.commit():
                print("Feedback API: Transaction committed successfully!")  # Debug log
                return jsonify({'success': True, 'message': 'Feedback submitted successfully!'}), 201
            else:
                print("Feedback API: Failed to commit transaction")  # Debug log
                return jsonify({'success': False, 'message': 'Database error: Could not commit feedback.'}), 500
        else:
            print("Feedback API: Failed to execute query")  # Debug log
            return jsonify({'success': False, 'message': 'Database error: Could not insert feedback.'}), 500
    except Exception as e:
        print(f"Feedback API: Exception occurred: {str(e)}")  # Debug log
        return jsonify({'success': False, 'message': f'Error: {str(e)}'}), 500