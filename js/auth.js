// Check if user is authenticated and has the correct role
function checkAuth(requiredRole) {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
        window.location.href = 'login.html';
        return false;
    }

    if (requiredRole && userRole !== requiredRole) {
        alert('Access denied. Only ' + requiredRole + ' can access this page.');
        window.location.href = 'login.html';
        return false;
    }

    return true;
}

// Add token to all fetch requests
function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return Promise.reject('No token found');
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
    };

    return fetch(url, {
        ...options,
        headers
    });
}

// Handle logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = 'login.html';
}

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    // Get the current page name
    const currentPage = window.location.pathname.split('/').pop();
    
    // Determine required role based on page
    let requiredRole = null;
    if (currentPage === 'government_admin.html') {
        requiredRole = 'government_admin';
    } else if (currentPage === 'system_admin.html') {
        requiredRole = 'system_admin';
    }

    // Check authentication
    if (requiredRole) {
        checkAuth(requiredRole);
    }

    // Add logout event listener to logout button if it exists
    const logoutButton = document.querySelector('a[href="login.html"]');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}); 