// Constants
const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const API_BASE_URL = '/api/government-admin';

// State variables
let currentSubcityId = null;
let currentOfficeId = null;

// Store all offices for filtering
let allOffices = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Robust authentication check
    const token = localStorage.getItem(TOKEN_KEY);
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem(USER_KEY) || '{}');
    } catch (e) {
        user = null;
    }
    if (!token || !user || user.role !== 'government_admin') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.href = 'login.html';
        return;
    }

    // Initialize dashboard
    initializeDashboard();
    
    // Load subcities and offices
    loadSubcities();
    loadOffices();

    // Initialize event listeners
    initializeEventListeners();

    // Show dashboard by default
    showSection('dashboard');
});

// Helper: handle 401 errors globally
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem(TOKEN_KEY);
    options.headers = options.headers || {};
    options.headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(url, options);
    if (response.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.href = 'login.html';
        throw new Error('Unauthorized');
    }
    return response;
}

// Initialize dashboard
function initializeDashboard() {
    // Load dashboard statistics
    loadDashboardStats();
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/dashboard/stats`);

        if (!response.ok) {
            throw new Error('Failed to load dashboard statistics');
        }

        const data = await response.json();
        if (data.success) {
            updateDashboardStats(data.stats);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading dashboard statistics:', error);
        // Set default values if API call fails
        updateDashboardStats({
            totalEmployees: 0,
            activeOffices: 0,
            pendingFeedback: 0,
            resolvedIssues: 0
        });
    }
}

// Update dashboard statistics
function updateDashboardStats(stats) {
    const totalEmployeesEl = document.getElementById('totalEmployees');
    const activeOfficesEl = document.getElementById('activeOffices');
    const pendingFeedbackEl = document.getElementById('pendingFeedback');
    const resolvedIssuesEl = document.getElementById('resolvedIssues');

    if (totalEmployeesEl) {
        totalEmployeesEl.textContent = stats.totalEmployees || 0;
    }
    if (activeOfficesEl) {
        activeOfficesEl.textContent = stats.activeOffices || 0;
    }
    if (pendingFeedbackEl) {
        pendingFeedbackEl.textContent = stats.pendingFeedback || 0;
    }
    if (resolvedIssuesEl) {
        resolvedIssuesEl.textContent = stats.resolvedIssues || 0;
    }
}

// Load subcities
async function loadSubcities() {
    try {
        console.log('Loading subcities...');
        
        // Try the government admin endpoint first
        let response = await fetchWithAuth(`${API_BASE_URL}/subcities`);

        console.log('Government admin subcities response:', response.status);

        // If that fails, try the main API endpoint
        if (!response.ok) {
            console.log('Trying main API endpoint...');
            response = await fetchWithAuth('/api/subcities');
            console.log('Main API subcities response:', response.status);
        }

        if (!response.ok) {
            throw new Error(`Failed to load subcities: ${response.status}`);
        }

        const data = await response.json();
        console.log('Subcities data:', data);
        
        if (data.success) {
            updateSubcityDropdowns(data.subcities);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading subcities:', error);
        // Show a more helpful error message
        console.log('Subcities will be loaded when available. Error:', error.message);
    }
}

// Update subcity dropdowns
function updateSubcityDropdowns(subcities) {
    console.log('Updating subcity dropdowns with:', subcities);
    
    const dropdowns = [
        document.getElementById('subcityFilter'),
        document.getElementById('employeeSubcity'),
        document.getElementById('editEmployeeSubcity'),
        document.getElementById('feedbackSubcityFilter')
    ];

    dropdowns.forEach((dropdown, index) => {
        if (dropdown && dropdown.options) {
            console.log(`Updating dropdown ${index}:`, dropdown.id);
            
            // Clear existing options except the first one
            while (dropdown.options.length > 1) {
                dropdown.remove(1);
            }

            // Add new options
            subcities.forEach(subcity => {
                const option = document.createElement('option');
                option.value = subcity.subcity_id;
                option.textContent = subcity.name;
                dropdown.appendChild(option);
            });
            
            console.log(`Dropdown ${dropdown.id} now has ${dropdown.options.length} options`);
        } else {
            console.log(`Dropdown ${index} not found or has no options`);
        }
    });
}

// Load offices (all, for filtering)
async function loadOffices() {
    try {
        console.log('Loading offices...');
        const response = await fetchWithAuth(`${API_BASE_URL}/offices`);
        if (!response.ok) {
            throw new Error(`Failed to load offices: ${response.status}`);
        }
        const data = await response.json();
        if (data.success) {
            allOffices = data.offices;
            updateOfficeDropdownsFiltered();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading offices:', error);
        console.log('Offices will be loaded when available. Error:', error.message);
    }
}

// Update office dropdowns based on selected subcity
function updateOfficeDropdownsFiltered() {
    const subcityId = document.getElementById('subcityFilter')?.value;
    const dropdowns = [
        document.getElementById('officeFilter'),
        document.getElementById('employeeOffice'),
        document.getElementById('editEmployeeOffice'),
        document.getElementById('feedbackOfficeFilter')
    ];
    dropdowns.forEach((dropdown, index) => {
        if (dropdown && dropdown.options) {
            while (dropdown.options.length > 1) {
                dropdown.remove(1);
            }
            let filteredOffices = allOffices;
            if (subcityId) {
                filteredOffices = allOffices.filter(o => String(o.subcity_id) === String(subcityId));
            }
            filteredOffices.forEach(office => {
                const option = document.createElement('option');
                option.value = office.office_id;
                option.textContent = office.office_name;
                dropdown.appendChild(option);
            });
            dropdown.disabled = false;
        }
    });
}

// Load offices by subcity
async function loadOfficesBySubcity(subcityId) {
    try {
        console.log('Loading offices for subcity:', subcityId);
        
        const response = await fetchWithAuth(`${API_BASE_URL}/offices?subcity_id=${subcityId}`);

        console.log('Offices by subcity response:', response.status);

        if (!response.ok) {
            throw new Error(`Failed to load offices: ${response.status}`);
        }

        const data = await response.json();
        console.log('Offices by subcity data:', data);
        
        if (data.success) {
            updateOfficeDropdowns(data.offices);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading offices by subcity:', error);
        console.log('Offices will be loaded when available. Error:', error.message);
    }
}

// Update office dropdowns
function updateOfficeDropdowns(offices) {
    console.log('Updating office dropdowns with:', offices);
    
    const dropdowns = [
        document.getElementById('officeFilter'),
        document.getElementById('employeeOffice'),
        document.getElementById('editEmployeeOffice'),
        document.getElementById('feedbackOfficeFilter')
    ];

    dropdowns.forEach((dropdown, index) => {
        if (dropdown && dropdown.options) {
            console.log(`Updating office dropdown ${index}:`, dropdown.id);
            
            // Clear existing options except the first one
            while (dropdown.options.length > 1) {
                dropdown.remove(1);
            }

            // Add new options
            offices.forEach(office => {
                const option = document.createElement('option');
                option.value = office.office_id;
                option.textContent = office.office_name;
                dropdown.appendChild(option);
            });

            // Enable the dropdown
            dropdown.disabled = false;
            
            console.log(`Office dropdown ${dropdown.id} now has ${dropdown.options.length} options`);
        } else {
            console.log(`Office dropdown ${index} not found or has no options`);
        }
    });
}

// Load employees
async function loadEmployees(subcityId = null, officeId = null) {
    try {
        let url = `${API_BASE_URL}/employees`;
        if (subcityId) {
            url += `?subcity_id=${subcityId}`;
            if (officeId) {
                url += `&office_id=${officeId}`;
            }
        }

        const response = await fetchWithAuth(url);

        if (!response.ok) {
            throw new Error('Failed to load employees');
        }

        const data = await response.json();
        if (data.success) {
            displayEmployees(data.employees);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading employees:', error);
        console.log('Employees will be loaded when available');
    }
}

// Display employees in the table
function displayEmployees(employees) {
    const tbody = document.getElementById('employeesList');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${employee.photo_url || 'images/default-avatar.png'}" alt="Employee photo" class="img-thumbnail" style="width: 50px; height: 50px;"></td>
            <td>${employee.full_name}</td>
            <td>${employee.position}</td>
            <td>${employee.subcity_name || 'N/A'}</td>
            <td>${employee.office_name || 'N/A'}</td>
            <td>${employee.email}</td>
            <td>${employee.phone || 'N/A'}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editEmployee(${employee.employee_id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${employee.employee_id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Subcity filter change
    const subcityFilter = document.getElementById('subcityFilter');
    if (subcityFilter) {
        subcityFilter.addEventListener('change', function() {
            const subcityId = this.value;
            updateOfficeDropdownsFiltered();
            document.getElementById('officeFilter').value = '';
            loadEmployees(subcityId, '');
        });
    }

    // Office filter change
    const officeFilter = document.getElementById('officeFilter');
    if (officeFilter) {
        officeFilter.addEventListener('change', function() {
            const subcityId = document.getElementById('subcityFilter')?.value;
            const officeId = this.value;
            loadEmployees(subcityId, officeId);
        });
    }

    // Employee subcity change
    const employeeSubcity = document.getElementById('employeeSubcity');
    if (employeeSubcity) {
        employeeSubcity.addEventListener('change', function() {
            const subcityId = this.value;
            if (subcityId) {
                loadOfficesBySubcity(subcityId);
                const employeeOffice = document.getElementById('employeeOffice');
                if (employeeOffice) {
                    employeeOffice.disabled = false;
                }
            } else {
                const employeeOffice = document.getElementById('employeeOffice');
                if (employeeOffice) {
                    employeeOffice.disabled = true;
                    employeeOffice.innerHTML = '<option value="">Select Office</option>';
                }
            }
        });
    }

    // Edit employee subcity change
    const editEmployeeSubcity = document.getElementById('editEmployeeSubcity');
    if (editEmployeeSubcity) {
        editEmployeeSubcity.addEventListener('change', function() {
            const subcityId = this.value;
            if (subcityId) {
                loadOfficesBySubcity(subcityId);
                const editEmployeeOffice = document.getElementById('editEmployeeOffice');
                if (editEmployeeOffice) {
                    editEmployeeOffice.disabled = false;
                }
            } else {
                const editEmployeeOffice = document.getElementById('editEmployeeOffice');
                if (editEmployeeOffice) {
                    editEmployeeOffice.disabled = true;
                    editEmployeeOffice.innerHTML = '<option value="">Select Office</option>';
                }
            }
        });
    }

    // Photo preview
    const employeePhoto = document.getElementById('employeePhoto');
    if (employeePhoto) {
        employeePhoto.addEventListener('change', function(e) {
            previewPhoto(this, 'photoPreview');
        });
    }

    const editEmployeePhoto = document.getElementById('editEmployeePhoto');
    if (editEmployeePhoto) {
        editEmployeePhoto.addEventListener('change', function(e) {
            previewPhoto(this, 'editPhotoPreview');
        });
    }
}

async function loadFeedback() {
    try {
        console.log('Loading feedback...');
        const response = await fetchWithAuth(`${API_BASE_URL}/feedback`);
        
        console.log('Feedback response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error loading feedback:', errorText);
            throw new Error('Failed to load feedback');
        }
        
        const data = await response.json();
        console.log('Feedback data:', data);
        
        if (data.success) {
            displayFeedbacks(data.feedbacks);
        } else {
            throw new Error(data.message || 'Failed to load feedback');
        }
    } catch (error) {
        console.error('Error loading feedback:', error);
        
        // Show error message
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger alert-dismissible fade show';
        errorAlert.role = 'alert';
        errorAlert.innerHTML = `
            Failed to load feedback: ${error.message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.getElementById('feedbackSection').prepend(errorAlert);
    }
}

// Display feedbacks in the feedback section
function displayFeedbacks(feedbacks) {
    const feedbackList = document.getElementById('feedbackList');
    if (!feedbackList) return;
    feedbackList.innerHTML = '';

    feedbacks.forEach(feedback => {
        const card = document.createElement('div');
        card.className = 'card feedback-card';
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${feedback.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">
                    ${feedback.employee_name ? 'Employee: ' + feedback.employee_name : ''}
                    ${feedback.office_name ? ' | Office: ' + feedback.office_name : ''}
                </h6>
                <p class="card-text">${feedback.message}</p>
                <p class="mb-1"><strong>User:</strong> ${feedback.user_email || 'Anonymous'}</p>
                <p class="mb-1"><strong>Rating:</strong> ${feedback.rating || 'N/A'}</p>
                <span class="feedback-status status-${feedback.status}">${feedback.status}</span>
                <button class="btn btn-primary btn-sm mt-2" onclick="showResponseModal(${feedback.feedback_id}, '${feedback.status}')">Respond</button>
            </div>
        `;
        feedbackList.appendChild(card);
    });
}

// Update showSection to load feedbacks when feedback section is shown
function showSection(sectionId) {
    // Hide all sections
    const sections = ['dashboard', 'employees', 'feedback', 'reports', 'settings'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = 'none';
        }
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }

    // Update active tab
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`[onclick*="${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Load feedbacks when feedback section is shown
    if (sectionId === 'feedback') {
        loadFeedback();
    }
}

// Photo preview
function previewPhoto(input, previewId) {
    const preview = document.getElementById(previewId);
    const file = input.files[0];

    if (file) {
        if (validatePhoto(file)) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (preview) {
                    preview.src = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        } else {
            input.value = '';
            if (preview) {
                preview.src = 'images/default-avatar.png';
            }
        }
    }
}

// Validate photo
function validatePhoto(file) {
    const maxSize = 4 * 1024 * 1024; // 4MB
    const allowedTypes = ['image/jpeg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG or PNG)');
        return false;
    }

    if (file.size > maxSize) {
        alert('Photo size should not exceed 4MB');
        return false;
    }

    return true;
}

// Add new employee
async function addEmployee() {
    const form = document.getElementById('addEmployeeForm');
    const formData = new FormData(form);

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/employees`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to add employee');
        }

        const data = await response.json();
        if (data.success) {
            alert('Employee added successfully');
            const modal = bootstrap.Modal.getInstance(document.getElementById('addEmployeeModal'));
            if (modal) {
                modal.hide();
            }
            form.reset();
            loadEmployees(currentSubcityId, currentOfficeId);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error adding employee:', error);
        alert('Failed to add employee. Please try again.');
    }
}

// Save employee (alias for addEmployee)
function saveEmployee() {
    addEmployee();
}

// Edit employee
async function editEmployee(employeeId) {
    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/employees/${employeeId}`);

        if (!response.ok) {
            throw new Error('Failed to load employee details');
        }

        const data = await response.json();
        if (data.success) {
            const employee = data.employee;
            
            // Populate the edit form
            document.getElementById('editEmployeeId').value = employee.employee_id;
            document.getElementById('editEmployeeName').value = employee.full_name;
            document.getElementById('editEmployeePosition').value = employee.position;
            document.getElementById('editEmployeeEmail').value = employee.email;
            document.getElementById('editEmployeeSubcity').value = employee.subcity_id;
            document.getElementById('editEmployeeOffice').value = employee.office_id;
            document.getElementById('editEmployeePhone').value = employee.phone || '';
            
            const photoPreview = document.getElementById('editPhotoPreview');
            if (photoPreview) {
                photoPreview.src = employee.photo_url || 'images/default-avatar.png';
            }

            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById('editEmployeeModal'));
            modal.show();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error loading employee details:', error);
        alert('Failed to load employee details. Please try again.');
    }
}

// Update employee
async function updateEmployee() {
    const form = document.getElementById('editEmployeeForm');
    const formData = new FormData(form);
    const employeeId = document.getElementById('editEmployeeId').value;

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/employees/${employeeId}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to update employee');
        }

        const data = await response.json();
        if (data.success) {
            alert('Employee updated successfully');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editEmployeeModal'));
            if (modal) {
                modal.hide();
            }
            loadEmployees(currentSubcityId, currentOfficeId);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error updating employee:', error);
        alert('Failed to update employee. Please try again.');
    }
}

// Delete employee
async function deleteEmployee(employeeId) {
    if (!confirm('Are you sure you want to delete this employee?')) {
        return;
    }

    try {
        const response = await fetchWithAuth(`${API_BASE_URL}/employees/${employeeId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Failed to delete employee');
        }

        const data = await response.json();
        if (data.success) {
            alert('Employee deleted successfully');
            loadEmployees(currentSubcityId, currentOfficeId);
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee. Please try again.');
    }
}

// Show response modal
function showResponseModal(feedbackId, status) {
    document.getElementById('feedbackId').value = feedbackId;
    document.getElementById('responseStatus').value = status;
    const modal = new bootstrap.Modal(document.getElementById('responseModal'));
    modal.show();
}

async function submitResponse() {
    const feedbackId = document.getElementById('feedbackId').value;
    const status = document.getElementById('responseStatus').value;
    const message = document.getElementById('responseMessage').value;

    if (!feedbackId || !status || !message) {
        alert('Please fill in all fields');
        return;
    }

    try {
        console.log('Submitting response with data:', { feedbackId, status, message });
        const url = `${API_BASE_URL}/feedback/${feedbackId}/respond`;
        console.log('Request URL:', url);
        
        const response = await fetchWithAuth(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                status, 
                message 
            })
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
            // Show success message
            const successAlert = document.createElement('div');
            successAlert.className = 'alert alert-success alert-dismissible fade show';
            successAlert.role = 'alert';
            successAlert.innerHTML = `
                Response submitted successfully!
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            document.getElementById('feedbackList').prepend(successAlert);
            
            // Hide modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('responseModal'));
            if (modal) {
                modal.hide();
            }
            
            // Reload feedback list
            loadFeedback();
            
            // Auto-dismiss the alert after 5 seconds
            setTimeout(() => {
                const alert = bootstrap.Alert.getOrCreateInstance(successAlert);
                alert.close();
            }, 5000);
        } else {
            throw new Error(data.message || 'Failed to submit response');
        }
    } catch (error) {
        console.error('Error submitting response:', error);
        
        // Show error message
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger alert-dismissible fade show';
        errorAlert.role = 'alert';
        errorAlert.innerHTML = `
            Failed to submit response: ${error.message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        document.getElementById('feedbackList').prepend(errorAlert);
        
        // Auto-dismiss the alert after 5 seconds
        setTimeout(() => {
            const alert = bootstrap.Alert.getOrCreateInstance(errorAlert);
            alert.close();
        }, 5000);
    }
}