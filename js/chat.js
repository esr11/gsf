// Chat state
let chatState = {
    isTyping: false,
    selectedFile: null,
    messages: [],
    chatEnded: false,
    currentConversation: null,
    token: localStorage.getItem('token')
};

// DOM Elements
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const chatMessages = document.getElementById('chatMessages');
const typingIndicator = document.getElementById('typingIndicator');
const fileInput = document.getElementById('fileInput');
const filePreview = document.getElementById('filePreview');
const fileName = document.getElementById('fileName');
const removeFile = document.getElementById('removeFile');
const endChatBtn = document.getElementById('endChatBtn');
const attachmentBtn = document.getElementById('attachmentBtn');

// Format time
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Add message to chat
function addMessage(content, isSent = false, file = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (file) {
        const fileElement = document.createElement('div');
        fileElement.className = 'file-attachment';
        fileElement.innerHTML = `
            <i class="fas fa-paperclip"></i>
            <a href="${file.url}" target="_blank">${file.name}</a>
        `;
        messageContent.appendChild(fileElement);
    }
    
    const textElement = document.createElement('div');
    textElement.textContent = content;
    messageContent.appendChild(textElement);
    
    const timeElement = document.createElement('div');
    timeElement.className = 'message-time';
    timeElement.textContent = formatTime(new Date());
    
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(timeElement);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to messages array
    chatState.messages.push({
        content,
        isSent,
        file,
        timestamp: new Date()
    });
}

// Handle file selection
fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        chatState.selectedFile = file;
        fileName.textContent = file.name;
        filePreview.style.display = 'block';
    }
});

// Remove selected file
removeFile.addEventListener('click', function() {
    chatState.selectedFile = null;
    fileInput.value = '';
    filePreview.style.display = 'none';
});

// Handle attachment button click
attachmentBtn.addEventListener('click', function() {
    fileInput.click();
});

// Handle message submission
messageForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (chatState.chatEnded) {
        alert('This chat has ended. Please start a new chat.');
        return;
    }
    
    const content = messageInput.value.trim();
    if (!content && !chatState.selectedFile) return;
    
    if (!chatState.token) {
        alert('Please log in to send messages.');
        return;
    }
    
    // Add user message to UI immediately
    addMessage(content, true, chatState.selectedFile ? {
        name: chatState.selectedFile.name,
        url: URL.createObjectURL(chatState.selectedFile)
    } : null);
    
    // Clear input and file
    messageInput.value = '';
    chatState.selectedFile = null;
    filePreview.style.display = 'none';
    fileInput.value = '';
    
    // Send message to server
    try {
        console.log('Sending message to server...');
        console.log('Current conversation ID:', chatState.currentConversation);
        console.log('Token:', chatState.token ? 'Present' : 'Missing');
        
        const messageData = {
            session_id: chatState.currentConversation,
            message: content
        };
        
        console.log('Message data:', messageData);
        
        const response = await fetch('/api/chat/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${chatState.token}`
            },
            body: JSON.stringify(messageData)
        });
        
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);
        
        if (response.ok) {
            const responseData = await response.json();
            console.log('Message sent successfully:', responseData);
        } else {
            const errorData = await response.text();
            console.error('Failed to send message. Status:', response.status);
            console.error('Error response:', errorData);
        }
    } catch (error) {
        console.error('Error sending message:', error);
    }
    
    // Show typing indicator
    typingIndicator.style.display = 'block';
    chatState.isTyping = true;
    
    // Simulate response after delay (in real implementation, this would be real-time)
    setTimeout(() => {
        typingIndicator.style.display = 'none';
        chatState.isTyping = false;
        
        // Add support response
        addMessage('Thank you for your message. Our support team will get back to you shortly.');
    }, 2000);
});

// Handle typing indicator
messageInput.addEventListener('input', function() {
    if (!chatState.chatEnded) {
        // In a real implementation, you would send a typing event to the server
        console.log('User is typing...');
    }
});

// End chat
endChatBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to end this chat?')) {
        chatState.chatEnded = true;
        messageInput.disabled = true;
        fileInput.disabled = true;
        endChatBtn.disabled = true;
        
        // Add system message
        const systemMessage = document.createElement('div');
        systemMessage.className = 'system-message';
        systemMessage.textContent = 'Chat ended';
        chatMessages.appendChild(systemMessage);
    }
});

// Load chat history
async function loadChatHistory() {
    console.log('Loading chat history...');
    console.log('Token:', chatState.token ? 'Present' : 'Missing');
    
    if (!chatState.token) {
        console.log('No token found, showing login message');
        addMessage('Please log in to start chatting with government support.', false);
        return;
    }
    
    try {
        console.log('Fetching user sessions...');
        // Get user sessions
        const response = await fetch('/api/chat/sessions', {
            headers: {
                'Authorization': `Bearer ${chatState.token}`
            }
        });
        
        console.log('Sessions response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Sessions response data:', data);
            
            if (data.sessions && data.sessions.length > 0) {
                console.log('Found existing sessions:', data.sessions.length);
                // Load the most recent active session
                const activeSession = data.sessions.find(s => s.status === 'active');
                if (activeSession) {
                    console.log('Loading active session:', activeSession.session_id);
                    await loadConversation(activeSession.session_id);
                } else {
                    console.log('No active session found, creating new one');
                    // Create a new session
                    await createNewSession();
                }
            } else {
                console.log('No sessions found, creating new one');
                // Create a new session
                await createNewSession();
            }
        } else {
            const errorData = await response.text();
            console.error('Failed to get sessions. Status:', response.status);
            console.error('Error response:', errorData);
            // Create a new session
            await createNewSession();
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
        await createNewSession();
    }
}

// Create new chat session
async function createNewSession() {
    try {
        console.log('Creating new chat session...');
        console.log('Token:', chatState.token ? 'Present' : 'Missing');
        
        const response = await fetch('/api/chat/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${chatState.token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Session creation response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Session creation response:', data);
            
            if (data.session) {
                chatState.currentConversation = data.session.session_id;
                console.log('New session created with ID:', data.session.session_id);
                addMessage('Welcome to the Government Service Feedback Chat. How can we help you today?', false);
            } else {
                console.log('No session data in response');
                addMessage('Welcome to the Government Service Feedback Chat. How can we help you today?', false);
            }
        } else {
            const errorData = await response.text();
            console.error('Failed to create session. Status:', response.status);
            console.error('Error response:', errorData);
            addMessage('Welcome to the Government Service Feedback Chat. How can we help you today?', false);
        }
    } catch (error) {
        console.error('Error creating session:', error);
        addMessage('Welcome to the Government Service Feedback Chat. How can we help you today?', false);
    }
}

// Load conversation with a specific session
async function loadConversation(sessionId) {
    try {
        const response = await fetch(`/api/chat/messages/${sessionId}`, {
            headers: {
                'Authorization': `Bearer ${chatState.token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            chatState.currentConversation = sessionId;
            
            // Clear existing messages
            chatMessages.innerHTML = '';
            chatState.messages = [];
            
            // Add messages to chat
            data.messages.forEach(msg => {
                const isSent = msg.is_sent_by_me;
                addMessage(msg.message, isSent);
            });
        }
    } catch (error) {
        console.error('Error loading conversation:', error);
    }
}

// Get current user ID from token
function getCurrentUserId() {
    if (!chatState.token) return null;
    
    try {
        const payload = JSON.parse(atob(chatState.token.split('.')[1]));
        return payload.user_id;
    } catch (error) {
        console.error('Error parsing token:', error);
        return null;
    }
}

// Initialize chat
document.addEventListener('DOMContentLoaded', function() {
    loadChatHistory();
}); 