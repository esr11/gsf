// Constants
const API_BASE_URL = '/api';

// Store email for use across steps
let userEmail = '';

// Function to toggle password visibility
function togglePasswordVisibility(inputId) {
  const input = document.getElementById(inputId);
  const button = input.nextElementSibling;
  if (input.type === 'password') {
    input.type = 'text';
    button.innerHTML = '<i class="fas fa-eye-slash"></i>';
  } else {
    input.type = 'password';
    button.innerHTML = '<i class="fas fa-eye"></i>';
  }
}

// Function to show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Function to update step indicators
function updateStepIndicators(currentStep) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else if (index + 1 < currentStep) {
            step.classList.add('completed');
        }
    });
}

// Function to show a specific step
function showStep(stepNumber) {
    // Hide all forms
    document.getElementById('emailForm').style.display = 'none';
    document.getElementById('verificationForm').style.display = 'none';
    document.getElementById('passwordForm').style.display = 'none';

    // Show the requested form
    switch(stepNumber) {
        case 1:
            document.getElementById('emailForm').style.display = 'block';
            break;
        case 2:
            document.getElementById('verificationForm').style.display = 'block';
            break;
        case 3:
            document.getElementById('passwordForm').style.display = 'block';
            break;
    }

    // Update step indicators
    updateStepIndicators(stepNumber);
}

// Step 1: Handle email submission
document.getElementById('emailForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    userEmail = email; // Store email for later use

    try {
        const response = await fetch('/api/send-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Verification code sent successfully! Please check your inbox.', 'success');
            showStep(2); // Move to verification step
        } else {
            showNotification(data.error || 'Failed to send verification code', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('An error occurred while sending verification code', 'error');
    }
});

// Step 2: Handle verification code
document.getElementById('verificationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const code = document.getElementById('verificationCode').value;

    try {
        const response = await fetch('/api/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: userEmail,
                code: code 
            })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Email verified successfully');
            showStep(3); // Move to password setup
        } else {
            showNotification(data.error || 'Invalid verification code', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('An error occurred while verifying code', 'error');
    }
});

// Handle resend code
document.getElementById('resendCode').addEventListener('click', async function() {
    try {
        const response = await fetch('/api/send-verification', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: userEmail })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('New verification code sent to your email');
        } else {
            showNotification(data.error || 'Failed to resend verification code', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('An error occurred while resending code', 'error');
    }
});

// Step 3: Handle password setup
document.getElementById('passwordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Password validation
    if (password.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return;
    }

    if (!/[A-Z]/.test(password)) {
        showNotification('Password must contain at least one uppercase letter', 'error');
        return;
    }

    if (!/[a-z]/.test(password)) {
        showNotification('Password must contain at least one lowercase letter', 'error');
        return;
    }

    if (!/[0-9]/.test(password)) {
        showNotification('Password must contain at least one number', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userEmail,
                password: password
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Account created successfully! Redirecting to login...');
            // Store token if provided
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);
        } else {
            showNotification(data.error || 'Failed to create account', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('An error occurred while creating account', 'error');
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    showStep(1); // Start with email step
}); 