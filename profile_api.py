from flask import Blueprint, jsonify, request
from db import Database

profile_api = Blueprint('profile_api', __name__)
db = Database()

@profile_api.route('/api/employees/grouped', methods=['GET'])
def get_employees_grouped():
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
    rows = db.fetch_all(query, params)
    grouped = {}
    for row in rows:
        subcity_id = row['subcity_id']
        office_id = row['office_id']
        subcity_name = row['subcity_name']
        office_name = row['office_name']
        if subcity_id not in grouped:
            grouped[subcity_id] = {
                'subcity_id': subcity_id,
                'subcity_name': subcity_name,
                'offices': {}
            }
        if office_id not in grouped[subcity_id]['offices']:
            grouped[subcity_id]['offices'][office_id] = {
                'office_id': office_id,
                'office_name': office_name,
                'employees': []
            }
        grouped[subcity_id]['offices'][office_id]['employees'].append({
            'employee_id': row['employee_id'],
            'full_name': row['full_name'],
            'position': row['position'],
            'photo_url': row['photo_url'],
            'email': row['email'],
            'phone': row['phone'],
            'created_at': row['created_at'],
            'updated_at': row['updated_at'],
        })
    # Convert to list structure for frontend
    result = []
    for subcity in grouped.values():
        offices = []
        for office in subcity['offices'].values():
            offices.append(office)
        subcity['offices'] = offices
        result.append(subcity)
    return jsonify({'success': True, 'data': result}) 