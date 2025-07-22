# Chat System Implementation

## Overview

The Government Service Feedback System now includes a complete chat functionality that allows users to communicate with government administrators for support and updates. The chat system is implemented with proper database storage, secure API endpoints, and a modern user interface.

## Database Structure

### Chat Tables

#### 1. `chat_sessions` Table
Stores chat sessions between users and administrators.

```sql
CREATE TABLE chat_sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    admin_id INT,
    status ENUM('active', 'closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE SET NULL
);
```

**Columns:**
- `session_id`: Unique identifier for the chat session
- `user_id`: ID of the user participating in the chat
- `admin_id`: ID of the government admin assigned to the chat (can be NULL)
- `status`: Session status ('active' or 'closed')
- `created_at`: When the session was created
- `updated_at`: When the session was last updated

#### 2. `chat_messages` Table
Stores individual messages within chat sessions.

```sql
CREATE TABLE chat_messages (
    message_id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT NOT NULL,
    sender_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

**Columns:**
- `message_id`: Unique identifier for the message
- `session_id`: ID of the chat session this message belongs to
- `sender_id`: ID of the user who sent the message
- `message`: The actual message content
- `is_read`: Whether the message has been read
- `created_at`: When the message was sent

## API Endpoints

### Chat Session Management

#### 1. Create Chat Session
- **URL**: `POST /api/chat/sessions`
- **Authentication**: Required (JWT token)
- **Roles**: `user`, `government_admin`
- **Description**: Creates a new chat session for the current user
- **Response**: Session details with session_id

#### 2. Get User Sessions
- **URL**: `GET /api/chat/sessions`
- **Authentication**: Required (JWT token)
- **Roles**: `user`, `government_admin`
- **Description**: Retrieves all chat sessions for the current user
- **Response**: List of sessions with user and admin details

#### 3. Close Chat Session
- **URL**: `PUT /api/chat/sessions/{session_id}/close`
- **Authentication**: Required (JWT token)
- **Roles**: `user`, `government_admin`
- **Description**: Closes a specific chat session
- **Response**: Success message

### Message Management

#### 1. Send Message
- **URL**: `POST /api/chat/messages`
- **Authentication**: Required (JWT token)
- **Roles**: `user`, `government_admin`
- **Body**: `{"session_id": 1, "message": "Hello!"}`
- **Description**: Sends a message in a specific chat session
- **Response**: Message details

#### 2. Get Messages
- **URL**: `GET /api/chat/messages/{session_id}`
- **Authentication**: Required (JWT token)
- **Roles**: `user`, `government_admin`
- **Description**: Retrieves all messages for a specific session
- **Response**: List of messages with sender details

#### 3. Mark Message as Read
- **URL**: `PUT /api/chat/messages/{message_id}/read`
- **Authentication**: Required (JWT token)
- **Roles**: `user`, `government_admin`
- **Description**: Marks a specific message as read
- **Response**: Success message

#### 4. Get Unread Count
- **URL**: `GET /api/chat/unread-count`
- **Authentication**: Required (JWT token)
- **Roles**: `user`, `government_admin`
- **Description**: Gets count of unread messages for the current user
- **Response**: Unread count

### Admin-Specific Endpoints

#### 1. Get Admin Sessions
- **URL**: `GET /api/chat/admin/sessions`
- **Authentication**: Required (JWT token)
- **Roles**: `government_admin`
- **Description**: Gets all chat sessions assigned to the current admin
- **Response**: List of sessions with unread counts

#### 2. Assign Session to Admin
- **URL**: `PUT /api/chat/admin/assign-session/{session_id}`
- **Authentication**: Required (JWT token)
- **Roles**: `government_admin`
- **Description**: Assigns an unassigned session to the current admin
- **Response**: Success message

## Frontend Implementation

### Chat Pages

#### 1. English Chat Page (`chat.html`)
- **File**: `chat.html`
- **JavaScript**: `js/chat.js`
- **CSS**: `css/chat.css`
- **Features**: 
  - Real-time message display
  - File attachment support
  - Typing indicators
  - Session management
  - Responsive design

#### 2. Amharic Chat Page (`chata.html`)
- **File**: `chata.html`
- **JavaScript**: `js/chata.js`
- **CSS**: `css/chat.css`
- **Features**: Same as English version but with Amharic text

### Navigation Integration

Chat icons have been added to all user-facing pages:
- Home pages (`home.html`, `homea.html`)
- Profile pages (`profile.html`, `profilea.html`)
- Feedback pages (`feedback.html`, `feedbacka.html`)
- Contact pages (`contact.html`, `contacta.html`)
- Subcity pages (`subcity.html`, `subcitya.html`)
- Office pages (`office.html`, `officea.html`)

### Chat Icon Styling

The chat icon features:
- Font Awesome icon (`fas fa-comments`)
- Blue color scheme matching the theme
- Hover effects with scaling and pulse animation
- Tooltips in both English and Amharic
- Responsive design

## Security Features

### Authentication
- All chat endpoints require JWT authentication
- Token validation on every request
- Role-based access control

### Authorization
- Users can only access their own sessions
- Admins can access assigned sessions
- Proper session ownership validation

### Data Validation
- Input validation for all message content
- Session existence verification
- User permission checks

## Usage Flow

### For Regular Users

1. **Access Chat**: Click the chat icon in the navigation
2. **Authentication**: Login if not already authenticated
3. **Session Creation**: System automatically creates or finds active session
4. **Send Messages**: Type and send messages
5. **Receive Responses**: Get responses from government admins
6. **End Chat**: Close session when done

### For Government Admins

1. **Access Admin Panel**: Use admin-specific endpoints
2. **View Sessions**: See all assigned chat sessions
3. **Assign Sessions**: Take ownership of unassigned sessions
4. **Respond to Users**: Send messages to users
5. **Monitor Activity**: Track unread messages and session status

## Testing

### Database Testing
Run the test script to verify database functionality:
```bash
python test_chat_db.py
```

This script tests:
- Table existence and structure
- Session creation and management
- Message sending and retrieval
- Read status updates
- Session closure
- Data cleanup

### API Testing
Test the API endpoints using tools like Postman or curl:

```bash
# Create a session
curl -X POST http://localhost:5000/api/chat/sessions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"

# Send a message
curl -X POST http://localhost:5000/api/chat/messages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"session_id": 1, "message": "Hello!"}'

# Get messages
curl -X GET http://localhost:5000/api/chat/messages/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## File Structure

```
gsf11/
├── chat_api.py              # Chat API endpoints
├── test_chat_db.py          # Database testing script
├── chat.html                # English chat page
├── chata.html               # Amharic chat page
├── js/
│   ├── chat.js              # English chat JavaScript
│   └── chata.js             # Amharic chat JavaScript
├── css/
│   ├── chat.css             # Chat styling
│   └── styles.css           # Updated with chat icon styles
└── create_tables.sql        # Database schema (includes chat tables)
```

## Future Enhancements

### Real-time Features
- WebSocket implementation for live messaging
- Push notifications for new messages
- Online/offline status indicators

### Advanced Features
- File sharing and document uploads
- Message search and filtering
- Chat history export
- Group chat functionality
- Message reactions and emojis

### Admin Features
- Chat analytics and reporting
- Automated responses and chatbots
- Session routing and load balancing
- Performance monitoring

## Troubleshooting

### Common Issues

1. **Messages not sending**: Check JWT token validity and session existence
2. **Session not found**: Verify user permissions and session ownership
3. **Database errors**: Run the test script to verify database connectivity
4. **Authentication errors**: Ensure proper token format and expiration

### Debug Mode
Enable debug logging in the database connection to see detailed SQL queries and responses.

## Conclusion

The chat system provides a complete communication platform between users and government administrators. It includes proper database storage, secure API endpoints, modern UI, and comprehensive testing. The system is ready for production use and can be extended with additional features as needed. 