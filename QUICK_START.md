# 🚀 Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies
```bash
pip install Flask==2.3.3 Flask-CORS==4.0.0 mysql-connector-python==8.1.0 PyJWT==2.8.0 bcrypt==4.0.1 requests==2.31.0 python-dotenv==1.0.0 Werkzeug==2.3.7
```

### 2. Set Up Database
```sql
CREATE DATABASE gsf;
USE gsf;
```

### 3. Import Database Schema
```bash
mysql -u your_username -p gsf < database_setup_complete.sql
```

### 4. Create Config File
Copy `sample_config.py` to `config.py` and update with your credentials:
```bash
cp sample_config.py config.py
# Edit config.py with your MySQL username/password
```

### 5. Run the App
```bash
python app.py
```

### 6. Open Browser
Go to: `http://localhost:5000`

## 🔑 Default Login Credentials

- **Admin:** admin@addisababa.gov.et / admin123
- **Government Admin:** government.admin@addisababa.gov.et / admin123  
- **User:** user@example.com / user123

## ✅ Test the System

1. Login as a regular user
2. Submit feedback to any office
3. Try the chat system
4. Login as admin to see the other side

That's it! 🎉 