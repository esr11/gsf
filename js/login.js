// Constants
const API_BASE_URL = 'http://localhost:5000/api';
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
    loginText.style.display = 'none';
    loginSpinner.style.display = 'inline-block';
    loginButton.disabled = true;
}

// Hide loading state
function hideLoading() {
    loginText.style.display = 'inline-block';
    loginSpinner.style.display = 'none';
    loginButton.disabled = false;
}

// Function to toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
}

// Function to show a section and hide others
function showSection(sectionId) {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('forgotPasswordSection').style.display = 'none';
    document.getElementById('resetPasswordSection').style.display = 'none';
    document.getElementById(sectionId).style.display = 'block';
}

// Handle successful login
function handleSuccessfulLogin(data) {
    // Store token and user data
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify({
        role: data.user.role,
        email: data.user.email
    }));

    // Redirect based on role
    const redirectMap = {
        'system_admin': 'system_admin.html',
        'government_admin': 'government_admin.html',
        'user': 'home.html'
    };

    const redirectUrl = redirectMap[data.user.role];
    if (redirectUrl) {
        window.location.href = redirectUrl;
    } else {
        console.error('Invalid role:', data.user.role);
        throw new Error(`Invalid user role: ${data.user.role}`);
    }
}

// Handle login error
function handleLoginError(error) {
    console.error('Login error:', error);
    showError(passwordError, error.message || 'An error occurred during login');
}

// Validate form inputs
function validateForm(email, password) {
    let isValid = true;

    // Clear previous errors
    clearError(emailError);
    clearError(passwordError);

    // Validate email
    if (!email) {
        showError(emailError, 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError(emailError, 'Please enter a valid email address');
        isValid = false;
    }

    // Validate password
    if (!password) {
        showError(passwordError, 'Password is required');
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
        console.error('Login form not found!');
        return;
    }

    // Check if user is already logged in
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
    
    // Only auto-redirect if we're not on the login page
    if (token && user.role && !window.location.pathname.includes('login.html')) {
        const redirectMap = {
            'system_admin': 'system_admin.html',
            'government_admin': 'government_admin.html',
            'user': 'subcity.html'
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
            backToHomeLink.textContent = 'Logout';
            backToHomeLink.href = '#';
            backToHomeLink.onclick = function(e) {
                e.preventDefault();
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_KEY);
                window.location.href = 'home.html';
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
            console.log('Attempting login...');
            
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            console.log('Login successful:', data);
            handleSuccessfulLogin(data);
        } catch (error) {
            console.error('Login error:', error);
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
    document.getElementById(buttonId).querySelector('span').style.display = 'none';
    document.getElementById(spinnerId).style.display = 'inline-block';
}

// Hide loading spinner
function hideSpinner(buttonId, spinnerId) {
    document.getElementById(buttonId).querySelector('span').style.display = 'inline';
    document.getElementById(spinnerId).style.display = 'none';
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

    // Forgot Password Form
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('resetEmail').value;
            
            clearError('resetEmailError');
            showSpinner('sendResetButton', 'resetSpinner');

            try {
                const response = await fetch('/api/send-verification', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email })
                });

                const data = await response.json();
                
                if (response.ok) {
                    showSection('resetPasswordSection');
                } else {
                    showError('resetEmailError', data.message || 'Failed to send reset code');
                }
            } catch (error) {
                showError('resetEmailError', 'Failed to send reset code. Please try again.');
            } finally {
                hideSpinner('sendResetButton', 'resetSpinner');
            }
        });
    }

    // Reset Password Form
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('resetEmail').value;
            const code = document.getElementById('verificationCode').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            clearError('codeError');
            clearError('newPasswordError');
            clearError('confirmPasswordError');

            if (newPassword !== confirmPassword) {
                showError('confirmPasswordError', 'Passwords do not match');
                return;
            }

            showSpinner('resetPasswordButton', 'resetPasswordSpinner');

            try {
                // First verify the code
                const verifyResponse = await fetch('/api/verify-code', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email, code: code })
                });

                const verifyData = await verifyResponse.json();
                
                if (!verifyResponse.ok) {
                    showError('codeError', verifyData.message || 'Invalid verification code');
                    return;
                }

                // Then set the new password
                const setupResponse = await fetch('/api/setup-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email, password: newPassword })
                });

                const setupData = await setupResponse.json();
                
                if (setupResponse.ok) {
                    alert('Password reset successful! Please login with your new password.');
                    showSection('loginSection');
                } else {
                    showError('newPasswordError', setupData.message || 'Failed to reset password');
                }
            } catch (error) {
                showError('codeError', 'Failed to reset password. Please try again.');
            } finally {
                hideSpinner('resetPasswordButton', 'resetPasswordSpinner');
            }
        });
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('password').value;

            clearError('emailError');
            clearError('passwordError');
            showSpinner('loginButton', 'loginSpinner');

            try {
                console.log('Attempting login...'); // Debug log
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email, password: password })
                });

                console.log('Response status:', response.status); // Debug log
                const data = await response.json();
                console.log('Response data:', data); // Debug log
                
                if (response.ok && data.success) {
                    console.log('Login successful, storing token...'); // Debug log
                    // Store the token and user data
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userRole', data.role);
                    localStorage.setItem('user', JSON.stringify({
                        id: data.user_id,
                        email: email,
                        role: data.role
                    }));
                    
                    // Clear any existing error messages
                    clearError('emailError');
                    clearError('passwordError');
                    
                    console.log('Redirecting based on role:', data.role); // Debug log
                    // Redirect based on user role
                    if (data.role === 'government_admin') {
                        window.location.href = 'government_admin.html';
                    } else if (data.role === 'system_admin') {
                        window.location.href = 'system_admin.html';
                    } else {
                        window.location.href = 'home.html';
                    }
                } else {
                    console.log('Login failed:', data.message); // Debug log
                    showError('emailError', data.message || 'Invalid email or password');
                }
            } catch (error) {
                console.error('Login error:', error); // Debug log
                showError('emailError', 'Failed to login. Please try again.');
            } finally {
                hideSpinner('loginButton', 'loginSpinner');
            }
        });
    }

    // Language toggle functionality
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', function(e) {
            e.preventDefault();
            const currentText = this.textContent;
            if (currentText === 'ENG') {
                window.location.href = 'logina.html';
            } else {
                window.location.href = 'login.html';
            }
        });

    }
});