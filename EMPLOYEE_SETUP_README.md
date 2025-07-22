# Enhanced Employee Management System

This document provides instructions for setting up and using the enhanced employee management system for the Government Service Feedback portal.

## 📋 Overview

The enhanced employee system includes:
- Comprehensive employee profiles with detailed information
- Employee ratings and feedback system
- Search and filter functionality
- Enhanced profile modal with detailed employee information
- Status tracking (Active, Inactive, On Leave, Terminated)

## 🗄️ Database Setup

### 1. Run the Enhanced Employee Table SQL

First, ensure you have MySQL running and the `gsf` database created. Then run the enhanced employee table SQL:

```bash
# Option 1: Run the Python script
python run_enhanced_employee_sql.py

# Option 2: Run directly in MySQL
mysql -u root -p gsf < enhanced_employee_table.sql
```

### 2. Database Structure

The enhanced employee table includes the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `employee_id` | INT | Primary key |
| `office_id` | INT | Foreign key to offices table |
| `full_name` | VARCHAR(255) | Employee's full name |
| `position` | VARCHAR(255) | Job position |
| `email` | VARCHAR(255) | Email address |
| `phone` | VARCHAR(20) | Phone number |
| `photo_url` | VARCHAR(500) | Profile photo URL |
| `date_of_birth` | DATE | Date of birth |
| `gender` | ENUM | Male/Female/Other |
| `address` | TEXT | Residential address |
| `emergency_contact` | VARCHAR(255) | Emergency contact name |
| `emergency_phone` | VARCHAR(20) | Emergency contact phone |
| `joining_date` | DATE | Employment start date |
| `salary` | DECIMAL(10,2) | Salary amount |
| `department` | VARCHAR(100) | Department name |
| `employee_id_number` | VARCHAR(50) | Unique employee ID |
| `status` | ENUM | Active/Inactive/On Leave/Terminated |
| `is_active` | BOOLEAN | Soft delete flag |

## 🚀 API Endpoints

The enhanced employee system provides the following API endpoints:

### Employee Management
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get single employee
- `POST /api/employees` - Add new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Soft delete employee

### Office-specific
- `GET /api/offices/:officeId/employees` - Get employees by office

### Search and Filter
- `GET /api/employees/search/:searchTerm` - Search employees

### Feedback System
- `POST /api/employees/:employeeId/feedback` - Submit employee feedback

## 🎯 Features

### 1. Enhanced Employee Profiles
- Detailed employee information display
- Profile photos
- Contact information
- Employment details
- Status tracking

### 2. Rating System
- 5-star rating system
- User feedback collection
- Average rating calculation
- Rating display in profiles

### 3. Search and Filter
- Search by name, position, email, department
- Filter by subcity and office
- Real-time search results

### 4. Status Management
- Active employees (green badge)
- Inactive employees (gray badge)
- On Leave employees (yellow badge)
- Terminated employees (red badge)

## 📱 Usage

### Office Page
1. Navigate to the office page
2. Select a subcity to view offices
3. Click "View Employees" to see employee list
4. Click on employee cards to view detailed profiles

### Profile Page
1. Use the search box to find specific employees
2. Use filters to narrow down results by subcity/office
3. Click on employee cards to view detailed profiles
4. View ratings, contact info, and employment details

### Employee Profile Modal
The enhanced modal displays:
- Employee photo
- Basic information (name, position, email)
- Office and subcity information
- Phone number (if available)
- Department (if available)
- Joining date (if available)
- Address (if available)
- Emergency contact (if available)
- Average rating and total ratings
- Status badge

## 🔧 Configuration

### Database Connection
Update the database connection settings in `run_enhanced_employee_sql.py`:

```python
connection = mysql.connector.connect(
    host='localhost',
    user='your_username',
    password='your_password',
    database='gsf'
)
```

### API Base URL
Update the API base URL in `js/profile.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

## 📊 Sample Data

The enhanced employee table comes with sample data including:
- 9 employees across 3 offices
- Various positions (Office Manager, Customer Service Officer, etc.)
- Sample ratings and feedback
- Different statuses and departments

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check MySQL is running
   - Verify database credentials
   - Ensure `gsf` database exists

2. **API Endpoints Not Working**
   - Check server is running on port 3000
   - Verify API routes are properly configured
   - Check database connection in API files

3. **Employee Photos Not Loading**
   - Ensure `uploads/employee_photos/` directory exists
   - Check file permissions
   - Verify photo URLs in database

4. **Search Not Working**
   - Check API endpoint is accessible
   - Verify search functionality in profile.js
   - Check browser console for errors

## 📝 Notes

- The system uses soft deletes (is_active flag) instead of hard deletes
- Employee ratings are unique per user-employee combination
- Photos are stored in the `uploads/employee_photos/` directory
- The system supports multiple image formats (jpg, png, gif, etc.)
- All timestamps are automatically managed by MySQL

## 🔄 Updates

To update the system:
1. Run the enhanced SQL script to update the database structure
2. Update the API routes if needed
3. Test the functionality
4. Deploy changes

For any issues or questions, please refer to the main project documentation or contact the development team. 