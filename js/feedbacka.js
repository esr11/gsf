// Function to show error message as modal popup (Amharic)
function showError(message) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="errorModalLabel">
                            <i class="fas fa-exclamation-triangle me-2"></i>ስህተት
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p class="mb-0" style="font-size: 1.1rem;">${message}</p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-danger btn-lg px-4" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>እሺ
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

// Function to show success message as modal popup (Amharic)
function showSuccess(message) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title" id="successModalLabel">
                            <i class="fas fa-check-circle me-2"></i>ተሳክቷል!
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body text-center">
                        <p class="mb-0" style="font-size: 1.1rem;">${message}</p>
                    </div>
                    <div class="modal-footer justify-content-center">
                        <button type="button" class="btn btn-success btn-lg px-4" data-bs-dismiss="modal" onclick="window.location.href='homea.html'">
                            <i class="fas fa-home me-2"></i>እሺ፣ ወደ መነሻ ሂድ
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

// Function to validate feedback content (Amharic messages)
function validateFeedback(title, message, rating) {
    if (title.length < 5) {
        showError('ርዕሱ ቢያንስ 5 ፊደላት መሆን አለበት');
        return false;
    }
    
    if (message.length < 10) {
        showError('መልእክቱ ቢያንስ 10 ፊደላት መሆን አለበት');
        return false;
    }
    
    if (message.length > 1000) {
        showError('መልእክቱ በጣም ረጅም ነው (ከፍተኛው 1000 ፊደላት)');
        return false;
    }
    
    if (!rating || rating < 1 || rating > 5) {
        showError('እባክዎ ትክክለኛ ደረጃ ይምረጡ');
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
                document.getElementById('employeeOffice').textContent = `ጽ/ቤት: ${employee.office_name}`;
                document.getElementById('employeeSubcity').textContent = `ክፍለ ከተማ: ${employee.subcity_name}`;
                
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
            document.getElementById('employeePosition').textContent = 'ሚና አይገኝም';
            document.getElementById('employeeOffice').textContent = 'ጽ/ቤት አይገኝም';
            document.getElementById('employeeSubcity').textContent = 'ክፍለ ከተማ አይገኝም';
            
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
        showError('ምንም ሰራተኛ አልተመረጠም። እባክዎ ወደ ኋላ ሄደው ሰራተኛ ይምረጡ።');
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> እያስገባ ነው...';
    
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
            showSuccess('ግብረ መልስዎን ስለ ሰጡ አመሰግናለሁ! በተሳካተ ሁኔታ ተሰጥቷል።');
            
            // Reset form
            this.reset();
        } else {
            throw new Error(result.message || 'ግብረ መልስ ማስገባት አልተሳካም');
        }
        
    } catch (error) {
        console.error('Error submitting feedback:', error);
        showError('ግብረ መልስ ማስገባት ላይ ስህተት አጋጥሟል። እባክዎ እንደገና ይሞክሩ።');
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