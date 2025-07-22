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
        alert('ይህ ውይይት አብቅቷል። እባክዎ አዲስ ውይይት ያስጀምሩ።');
        return;
    }
    
    const content = messageInput.value.trim();
    if (!content && !chatState.selectedFile) return;
    
    if (!chatState.token) {
        alert('እባክዎ መልእክት ለመላክ ይግቡ።');
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
        const messageData = {
            session_id: chatState.currentConversation,
            message: content
        };
        
        const response = await fetch('/api/chat/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${chatState.token}`
            },
            body: JSON.stringify(messageData)
        });
        
        if (!response.ok) {
            console.error('Failed to send message');
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
        addMessage('መልእክትዎን ስለላኩ እናመሰግናለን። የድጋፍ ቡድናችን በቅርቡ ያገኝዎታል።');
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
    if (confirm('ይህን ውይይት ማቁት እርግጠኛ ነዎት?')) {
        chatState.chatEnded = true;
        messageInput.disabled = true;
        fileInput.disabled = true;
        endChatBtn.disabled = true;
        
        // Add system message
        const systemMessage = document.createElement('div');
        systemMessage.className = 'system-message';
        systemMessage.textContent = 'ውይይት አብቅቷል';
        chatMessages.appendChild(systemMessage);
    }
});

// Load chat history
async function loadChatHistory() {
    if (!chatState.token) {
        addMessage('እባክዎ ከመንግስት ድጋፍ ጋር ለመወያየት ይግቡ።', false);
        return;
    }
    
    try {
        // Get user sessions
        const response = await fetch('/api/chat/sessions', {
            headers: {
                'Authorization': `Bearer ${chatState.token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.sessions && data.sessions.length > 0) {
                // Load the most recent active session
                const activeSession = data.sessions.find(s => s.status === 'active');
                if (activeSession) {
                    await loadConversation(activeSession.session_id);
                } else {
                    // Create a new session
                    await createNewSession();
                }
            } else {
                // Create a new session
                await createNewSession();
            }
        } else {
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
        const response = await fetch('/api/chat/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${chatState.token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.session) {
                chatState.currentConversation = data.session.session_id;
                addMessage('የመንግስት አገልግሎት ግብረ-መልስ ውይይት እንኳን በደህና መጡ። እንዴት ልንረዳዎት እንችላለን?', false);
            }
        } else {
            addMessage('የመንግስት አገልግሎት ግብረ-መልስ ውይይት እንኳን በደህና መጡ። እንዴት ልንረዳዎት እንችላለን?', false);
        }
    } catch (error) {
        console.error('Error creating session:', error);
        addMessage('የመንግስት አገልግሎት ግብረ-መልስ ውይይት እንኳን በደህና መጡ። እንዴት ልንረዳዎት እንችላለን?', false);
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

// Initialize chat
document.addEventListener('DOMContentLoaded', function() {
    loadChatHistory();
}); 