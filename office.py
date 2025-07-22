from flask import Blueprint, request, jsonify
from db import Database

# Initialize Blueprint
office_bp = Blueprint('office', __name__)

# Initialize DB
db = Database()

@office_bp.route('/api/subcity/<int:subcity_id>', methods=['GET'])
def get_subcity_with_offices(subcity_id):
    """
    Fetches subcity info + all offices under that subcity.
    """
    try:
        # Get subcity
        subcity = db.fetch_one(
            "SELECT subcity_id, name AS subcity_name, description FROM subcities WHERE subcity_id = %s",
            (subcity_id,)
        )
        if not subcity:
            return jsonify({'error': 'Subcity not found'}), 404

        # Get offices
        offices = db.fetch_all(
            "SELECT office_id, office_name FROM offices WHERE subcity_id = %s",
            (subcity_id,)
        )

        return jsonify({
            'success': True,
            'subcity': subcity,
            'offices': offices
        })

    except Exception as e:
        print(f"Error fetching subcity data: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500