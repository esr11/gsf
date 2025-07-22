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
// ✅ SIMPLE IMAGE ERROR FIX - Only fixes broken images, doesn't replace content
function fixImageErrors() {
const images = document.querySelectorAll('img');
images.forEach(img => {
img.addEventListener('error', function() {
// Create a simple placeholder if image fails to load
const subcityName = this.alt ? this.alt.replace(' Sub-City', '').replace('-', ' ') : 'Sub-City';
// Create SVG placeholder
const svg = `data:image/svg+xml;base64,${btoa(`
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
<rect width="300" height="200" fill="#0d6efd"/>
<text x="150" y="100" font-family="Arial" font-size="14" font-weight="bold" 
text-anchor="middle" dominant-baseline="middle" fill="white">
${subcityName}
</text>
</svg>
`)}`;
this.src = svg;
this.onerror = null; // Prevent infinite loop
});
});
}
// Handle subcity selection (your existing code)
document.addEventListener('DOMContentLoaded', function() {
const subcityCards = document.querySelectorAll('.card .btn-primary');
subcityCards.forEach(card => {
card.addEventListener('click', function(e) {
e.preventDefault();
// Get subcity name from the card title
const subcityName = this.closest('.card').querySelector('.card-title').textContent.trim();
// Store selected subcity in sessionStorage
sessionStorage.setItem('selectedSubcity', subcityName);
// Redirect to office page
window.location.href = 'office.html';
});
});
});
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
// Initialize page
initPage();
// Fix any image errors (but don't replace content)
fixImageErrors();
// DON'T load from database - keep your existing HTML as-is
console.log('✅ Subcity page initialized with existing content');
});