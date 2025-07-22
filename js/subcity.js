// Constants
const API_BASE_URL = '/api';
const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Function to check if user is logged in
function checkAuth() {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
    return token && user.role;
}

// Function to handle office link clicks
function handleOfficeLink(event) {
    if (!checkAuth()) {
        event.preventDefault();
        // Store the intended destination
        const subcity = event.target.closest('.card').querySelector('a').getAttribute('href');
        localStorage.setItem('redirect_after_login', subcity);
        // Redirect to login
        window.location.href = 'login.html';
    }
}

// Function to initialize the page
function initPage() {
    // Check if we have a redirect after login
    const redirectAfterLogin = localStorage.getItem('redirect_after_login');
    if (redirectAfterLogin && checkAuth()) {
        localStorage.removeItem('redirect_after_login');
        window.location.href = redirectAfterLogin;
    }

    // Add click handlers to all office links
    const officeLinks = document.querySelectorAll('.card a.btn-primary');
    officeLinks.forEach(link => {
        link.addEventListener('click', handleOfficeLink);
    });
}

// Load subcities when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSubcities();
});

// Load subcities from the database
async function loadSubcities() {
    try {
        const response = await fetch(`${API_BASE_URL}/subcities`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load subcities');
        }

        const data = await response.json();
        const subcities = data.subcities;

        // Update the subcities container
        const container = document.querySelector('.row');
        container.innerHTML = subcities.map(subcity => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow">
                    <img src="images/${subcity.name.toLowerCase().replace(/\s+/g, '-')}.jpg" 
                         class="card-img-top" 
                         alt="${subcity.name} Sub-City"
                         onerror="this.src='images/default-subcity.jpg'">
                    <div class="card-body">
                        <h5 class="card-title">${subcity.name} Sub-City Administration</h5>
                        <p class="card-text">${subcity.description || 'No description available'}</p>
                        <a href="office.html?subcity_id=${subcity.subcity_id}" class="btn btn-primary">View Offices</a>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading subcities:', error);
        alert('Failed to load subcities. Please try again.');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const subcityCards = document.querySelectorAll('.card .btn-primary');
    
    subcityCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get subcity name from the card
            const cardElement = this.closest('.card');
            const subcityName = cardElement.querySelector('.card-title').textContent.trim();
            
            // Store selected subcity in sessionStorage
            sessionStorage.setItem('selectedSubcity', subcityName);
            sessionStorage.setItem('selectedSubcityId', subcityName.toLowerCase().replace(/\s+/g, '-'));
            
            // Redirect to office page
            window.location.href = 'office.html';
        });
    });
}); 