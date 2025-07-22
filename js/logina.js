// Constants
const API_BASE_URL = '/api';
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// DOM Elements
let loginForm;
let loginButton;
let loginText;
let loginSpinner;
let emailError;
let passwordError;

// Email validation function
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Password strength validation
function validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return re.test(password);
}

// Show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Clear error message
function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

// Show loading state
function showLoading() {
    if (loginText) loginText.style.display = 'none';
    if (loginSpinner) loginSpinner.style.display = 'inline-block';
    if (loginButton) loginButton.disabled = true;
}

// Hide loading state
function hideLoading() {
    if (loginText) loginText.style.display = 'inline-block';
    if (loginSpinner) loginSpinner.style.display = 'none';
    if (loginButton) loginButton.disabled = false;
}

// Function to toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
    }
}

// Function to show a section and hide others
function showSection(sectionId) {
    const sections = ['loginSection', 'forgotPasswordSection', 'resetPasswordSection'];
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = id === sectionId ? 'block' : 'none';
        }
    });
}

// Handle successful login
function handleSuccessfulLogin(data) {
    // Store token and user data
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify({
        role: data.role,
        email: data.email,
        name: data.name
    }));

    // Redirect based on role
    const redirectMap = {
        'system_admin': 'system_admin.html',
        'government_admin': 'government_admin.html',
        'user': 'homea.html'
    };

    const redirectUrl = redirectMap[data.role];
    if (redirectUrl) {
        window.location.href = redirectUrl;
    } else {
        throw new Error('የተጠቃሚ ሚና የማይሰራ ነው');
    }
}

// Handle login error
function handleLoginError(error) {
    console.error('የመግቢያ ስህተት:', error);
    if (passwordError) {
        showError('passwordError', error.message || 'በመግቢያ ላይ ስህተት ተከስቷል');
    }
}

// Validate form inputs
function validateForm(email, password) {
    let isValid = true;

    // Clear previous errors
    clearError('emailError');
    clearError('passwordError');

    // Validate email
    if (!email) {
        showError('emailError', 'ኢሜይል ያስፈልጋል');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('emailError', 'እባክዎ ትክክለኛ ኢሜይል አድራሻ ያስገቡ');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showError('passwordError', 'የይለፍ ቃል ያስፈልጋል');
        isValid = false;
    }

    return isValid;
}

// Initialize login functionality
function initLogin() {
    // Get DOM elements
    loginForm = document.getElementById('loginForm');
    loginButton = document.getElementById('loginButton');
    loginText = document.getElementById('loginText');
    loginSpinner = document.getElementById('loginSpinner');
    emailError = document.getElementById('emailError');
    passwordError = document.getElementById('passwordError');

    if (!loginForm) {
        console.error('የመግቢያ ቅጽ አልተገኘም!');
        return;
    }

    // Check if user is already logged in
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
    
    // Only auto-redirect if we're not on the login page
    if (token && user.role && !window.location.pathname.includes('logina.html')) {
        const redirectMap = {
            'system_admin': 'system_admin.html',
            'government_admin': 'government_admin.html',
            'user': 'homea.html'
        };
        const redirectUrl = redirectMap[user.role];
        if (redirectUrl) {
            window.location.href = redirectUrl;
            return;
        }
    }

    // Add logout button if user is logged in
    if (token && user.role) {
        const backToHomeLink = document.querySelector('.text-center.mt-4 a');
        if (backToHomeLink) {
            backToHomeLink.textContent = 'ውጣ';
            backToHomeLink.href = '#';
            backToHomeLink.onclick = function(e) {
                e.preventDefault();
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
                window.location.href = 'homea.html';
            };
        }
    }

    // Add form submit event listener
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('password').value;
        
        // Validate form
        if (!validateForm(email, password)) {
            return;
        }

        try {
            showLoading();
            
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    email: email,
                    password: password
                })
            });
            
            const data = await response.json();
            console.log('የመግቢያ ምላሽ:', data);  // Debug log
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'መግቢያ አልተሳካም');
            }
            
            handleSuccessfulLogin(data);
        } catch (error) {
            handleLoginError(error);
        } finally {
            hideLoading();
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initLogin);

// Show loading spinner
function showSpinner(buttonId, spinnerId) {
    const button = document.getElementById(buttonId);
    const spinner = document.getElementById(spinnerId);
    if (button && spinner) {
        button.querySelector('span').style.display = 'none';
        spinner.style.display = 'inline-block';
    }
}

// Hide loading spinner
function hideSpinner(buttonId, spinnerId) {
    const button = document.getElementById(buttonId);
    const spinner = document.getElementById(spinnerId);
    if (button && spinner) {
        button.querySelector('span').style.display = 'inline';
        spinner.style.display = 'none';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Forgot Password Link
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('forgotPasswordSection');
        });
    }

    // Back to Login
    const backToLogin = document.getElementById('backToLogin');
    if (backToLogin) {
        backToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            showSection('loginSection');
        });
    }
  });