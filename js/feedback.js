// Function to show error message as modal popup
function showError(message) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="errorModalLabel">
                            <i class="fas fa-exclamation-triangle me-2"></i>Error
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p class="mb-0" style="font-size: 1.1rem;">${message}</p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-danger btn-lg px-4" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove any existing modal
    const existingModal = document.getElementById('errorModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('errorModal'));
    modal.show();
}

// Function to show success message as modal popup
function showSuccess(message) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title" id="successModalLabel">
                            <i class="fas fa-check-circle me-2"></i>Success!
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p class="mb-0" style="font-size: 1.1rem;">${message}</p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-success btn-lg px-4" data-bs-dismiss="modal" onclick="window.location.href='home.html'">
                            <i class="fas fa-home me-2"></i>OK, Go to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove any existing modal
    const existingModal = document.getElementById('successModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

// Function to validate feedback content
function validateFeedback(title, message, rating) {
    if (title.length < 5) {
        showError('Title must be at least 5 characters long');
        return false;
    }
    
    if (message.length < 10) {
        showError('Message must be at least 10 characters long');
        return false;
    }
    
    if (message.length > 1000) {
        showError('Message is too long (maximum 1000 characters)');
        return false;
    }
    
    if (!rating || rating < 1 || rating > 5) {
        showError('Please select a valid rating');
        return false;
    }
    
    return true;
}

// Load employee information from URL parameters
async function loadEmployeeInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const employeeId = urlParams.get('employee_id');
    const employeeName = urlParams.get('employee_name');
    
    console.log('URL Parameters:', { employeeId, employeeName }); // Debug log
    
    if (employeeId && employeeName) {
        try {
            // Fetch employee details from API
            const response = await fetch(`/api/employees/${employeeId}`);
            console.log('API Response status:', response.status); // Debug log
            
            if (response.ok) {
                const data = await response.json();
                console.log('Employee data:', data); // Debug log
                const employee = data.employee;
                
                // Display employee information
                document.getElementById('employeeInfo').style.display = 'block';
                document.getElementById('employeePhoto').src = employee.photo_url || 'images/default-avatar.png';
                document.getElementById('employeeName').textContent = employee.full_name;
                document.getElementById('employeePosition').textContent = employee.position;
                document.getElementById('employeeOffice').textContent = `Office: ${employee.office_name}`;
                document.getElementById('employeeSubcity').textContent = `Subcity: ${employee.subcity_name}`;
                
                // Store employee data for form submission
                window.selectedEmployee = employee;
            } else {
                throw new Error(`API returned ${response.status}`);
            }
        } catch (error) {
            console.error('Error loading employee info:', error);
            // Fallback to URL parameters - show basic info
            document.getElementById('employeeInfo').style.display = 'block';
            document.getElementById('employeeName').textContent = decodeURIComponent(employeeName);
            document.getElementById('employeePosition').textContent = 'Position not available';
            document.getElementById('employeeOffice').textContent = 'Office not available';
            document.getElementById('employeeSubcity').textContent = 'Subcity not available';
            
            // Create a basic employee object for form submission
            window.selectedEmployee = {
                employee_id: employeeId,
                full_name: decodeURIComponent(employeeName),
                office_id: null // This will need to be handled
            };
        }
    } else {
        console.log('No employee parameters found in URL');
    }
}

// Handle feedback form submission
document.getElementById('feedbackForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const message = document.getElementById('message').value;
    const rating = parseInt(document.getElementById('rating').value);
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Validate feedback
    if (!validateFeedback(title, message, rating)) {
        return;
    }
    
    // Check if employee is selected
    if (!window.selectedEmployee) {
        showError('No employee selected. Please go back and select an employee.');
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
    
    // Create feedback data object
    const feedbackData = {
        employee_id: window.selectedEmployee.employee_id,
        office_id: window.selectedEmployee.office_id || 0, // Provide default if null
        title: title,
        message: message,
        rating: rating,
        user_name: name,
        user_email: email
    };
    
    console.log('Submitting feedback data:', feedbackData); // Debug log
    
    try {
        // Send feedback to backend
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(feedbackData)
        });
        
        console.log('Response status:', response.status); // Debug log
        
        const result = await response.json();
        console.log('Response data:', result); // Debug log
        
        if (response.ok) {
            // Show success message as modal popup
            showSuccess('Thank you for your feedback! It has been submitted successfully.');
            
            // Reset form
            this.reset();
        } else {
            throw new Error(result.message || 'Failed to submit feedback');
        }
        
    } catch (error) {
        console.error('Error submitting feedback:', error);
        showError('Error submitting feedback. Please try again.');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Get user email from localStorage
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('user')) || JSON.parse(localStorage.getItem('USER_KEY'));
    } catch (e) {}
    if (user && user.email) {
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.value = user.email;
            emailInput.readOnly = true;
        }
    }
    loadEmployeeInfo();
});
