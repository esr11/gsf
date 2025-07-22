 // Navigation handling
document.addEventListener('DOMContentLoaded', function() {
    // Show dashboard by default
    showSection('dashboard');
    
    // Add click handlers for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('href').substring(1);
            showSection(section);
        });
    });

    // Load initial data
    loadDashboardData();
    loadEmployees();
    loadFeedback();
    loadReports();
    loadProfileSettings();
});

// Function to show selected section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('d-none');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.remove('d-none');
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
}

// Dashboard Functions
async function loadDashboardData() {
    try {
        const response = await fetch('/api/admin/dashboard');
        const data = await response.json();

        if (data.success) {
            // Update statistics
            document.getElementById('totalEmployees').textContent = data.stats.totalEmployees;
            document.getElementById('activeEmployees').textContent = data.stats.activeEmployees;
            document.getElementById('pendingFeedback').textContent = data.stats.pendingFeedback;
            document.getElementById('resolvedIssues').textContent = data.stats.resolvedIssues;

            // Update recent activity
            const activityTable = document.getElementById('recentActivity');
            activityTable.innerHTML = '';
            
            data.recentActivity.forEach(activity => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(activity.date).toLocaleDateString()}</td>
                    <td>${activity.description}</td>
                    <td><span class="badge bg-${activity.status === 'Completed' ? 'success' : 'warning'}">${activity.status}</span></td>
                `;
                activityTable.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showNotification('Error loading dashboard data', 'error');
    }
}

// Employee Management Functions
async function loadEmployees() {
    try {
        const response = await fetch('/api/admin/employees');
        const data = await response.json();

        if (data.success) {
            const tbody = document.querySelector('#employeesTable tbody');
            tbody.innerHTML = '';

            data.employees.forEach(employee => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <img src="${employee.photo_url || '/images/default-avatar.png'}" 
                             alt="${employee.first_name}" 
                             class="employee-photo"
                             style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                    </td>
                    <td>${employee.employee_id_number}</td>
                    <td>${employee.first_name} ${employee.last_name}</td>
                    <td>${employee.department}</td>
                    <td>${employee.position}</td>
                    <td><span class="badge bg-${employee.status === 'Active' ? 'success' : 'warning'}">${employee.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editEmployee(${employee.employee_id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${employee.employee_id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Error loading employees:', error);
        showNotification('Error loading employees', 'error');
    }
}

async function addEmployee() {
    const form = document.getElementById('addEmployeeForm');
    const formData = new FormData(form);

    try {
        const response = await fetch('/api/admin/employees', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Employee added successfully', 'success');
            form.reset();
            $('#addEmployeeModal').modal('hide');
            loadEmployees();
        } else {
            showNotification(data.error || 'Failed to add employee', 'error');
        }
    } catch (error) {
        console.error('Error adding employee:', error);
        showNotification('Error adding employee', 'error');
    }
}

async function editEmployee(employeeId) {
    try {
        const response = await fetch(`/api/admin/employees/${employeeId}`);
        const data = await response.json();

        if (data.success) {
            const employee = data.employee;
            const form = document.getElementById('editEmployeeForm');
            
            // Populate form fields
            form.querySelector('[name="firstName"]').value = employee.first_name;
            form.querySelector('[name="lastName"]').value = employee.last_name;
            form.querySelector('[name="email"]').value = employee.email;
            form.querySelector('[name="phone"]').value = employee.phone;
            form.querySelector('[name="department"]').value = employee.department;
            form.querySelector('[name="position"]').value = employee.position;
            form.querySelector('[name="employeeId"]').value = employee.employee_id_number;
            form.querySelector('[name="joiningDate"]').value = employee.joining_date;
            form.querySelector('[name="dateOfBirth"]').value = employee.date_of_birth;
            form.querySelector('[name="gender"]').value = employee.gender;
            form.querySelector('[name="address"]').value = employee.address;
            form.querySelector('[name="emergencyContact"]').value = employee.emergency_contact;
            form.querySelector('[name="emergencyPhone"]').value = employee.emergency_phone;

            // Show modal
            $('#editEmployeeModal').modal('show');
        }
    } catch (error) {
        console.error('Error loading employee details:', error);
        showNotification('Error loading employee details', 'error');
    }
}

async function updateEmployee(employeeId) {
    const form = document.getElementById('editEmployeeForm');
    const formData = new FormData(form);

    try {
        const response = await fetch(`/api/admin/employees/${employeeId}`, {
            method: 'PUT',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Employee updated successfully', 'success');
            $('#editEmployeeModal').modal('hide');
            loadEmployees();
        } else {
            showNotification(data.error || 'Failed to update employee', 'error');
        }
    } catch (error) {
        console.error('Error updating employee:', error);
        showNotification('Error updating employee', 'error');
    }
}

async function deleteEmployee(employeeId) {
    if (!confirm('Are you sure you want to delete this employee?')) {
        return;
    }

    try {
        const response = await fetch(`/api/admin/employees/${employeeId}`, {
            method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Employee deleted successfully', 'success');
            loadEmployees();
        } else {
            showNotification(data.error || 'Failed to delete employee', 'error');
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        showNotification('Error deleting employee', 'error');
    }
}

// Feedback Management Functions
async function loadFeedback() {
    try {
        const response = await fetch('/api/admin/feedback');
        const data = await response.json();

        if (data.success) {
            const tbody = document.querySelector('#feedbackTable tbody');
            tbody.innerHTML = '';

            data.feedback.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${new Date(item.date).toLocaleDateString()}</td>
                    <td>${item.user_name}</td>
                    <td>${item.category}</td>
                    <td>${item.message.substring(0, 50)}${item.message.length > 50 ? '...' : ''}</td>
                    <td><span class="badge bg-${item.status === 'Resolved' ? 'success' : 'warning'}">${item.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewFeedback(${item.feedback_id})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (error) {
        console.error('Error loading feedback:', error);
        showNotification('Error loading feedback', 'error');
    }
}

async function viewFeedback(feedbackId) {
    try {
        const response = await fetch(`/api/admin/feedback/${feedbackId}`);
        const data = await response.json();

        if (data.success) {
            const feedback = data.feedback;
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.innerHTML = '';

            // Add feedback message
            const feedbackMsg = document.createElement('div');
            feedbackMsg.className = 'message user-message';
            feedbackMsg.innerHTML = `
                <div class="message-content">
                    <strong>${feedback.user_name}</strong>
                    <p>${feedback.message}</p>
                    <small>${new Date(feedback.date).toLocaleString()}</small>
                </div>
            `;
            chatMessages.appendChild(feedbackMsg);

            // Add responses
            feedback.responses.forEach(response => {
                const responseMsg = document.createElement('div');
                responseMsg.className = 'message admin-message';
                responseMsg.innerHTML = `
                    <div class="message-content">
                        <strong>Admin</strong>
                        <p>${response.message}</p>
                        <small>${new Date(response.date).toLocaleString()}</small>
                    </div>
                `;
                chatMessages.appendChild(responseMsg);
            });

            // Show modal
            $('#feedbackModal').modal('show');
        }
    } catch (error) {
        console.error('Error loading feedback details:', error);
        showNotification('Error loading feedback details', 'error');
    }
}

// Reports Functions
async function loadReports() {
    try {
        const response = await fetch('/api/admin/reports');
        const data = await response.json();

        if (data.success) {
            // Feedback Statistics Chart
            const feedbackCtx = document.getElementById('feedbackChart').getContext('2d');
            new Chart(feedbackCtx, {
                type: 'bar',
                data: {
                    labels: data.feedbackStats.labels,
                    datasets: [{
                        label: 'Feedback by Category',
                        data: data.feedbackStats.data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Employee Distribution Chart
            const employeeCtx = document.getElementById('employeeChart').getContext('2d');
            new Chart(employeeCtx, {
                type: 'pie',
                data: {
                    labels: data.employeeStats.labels,
                    datasets: [{
                        data: data.employeeStats.data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(255, 206, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)'
                        ]
                    }]
                },
                options: {
                    responsive: true
                }
            });
        }
    } catch (error) {
        console.error('Error loading reports:', error);
        showNotification('Error loading reports', 'error');
    }
}

async function exportReport(format) {
    try {
        const response = await fetch(`/api/admin/reports/export?format=${format}`);
        const blob = await response.blob();
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    } catch (error) {
        console.error('Error exporting report:', error);
        showNotification('Error exporting report', 'error');
    }
}

// Settings Functions
async function loadProfileSettings() {
    try {
        const response = await fetch('/api/admin/profile');
        const data = await response.json();

        if (data.success) {
            const profile = data.profile;
            document.getElementById('currentName').value = profile.name;
            document.getElementById('currentEmail').value = profile.email;
            document.getElementById('emailNotifications').checked = profile.email_notifications;
            document.getElementById('smsNotifications').checked = profile.sms_notifications;
        }
    } catch (error) {
        console.error('Error loading profile settings:', error);
        showNotification('Error loading profile settings', 'error');
    }
}

// Profile form submission
document.getElementById('profileForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    try {
        const response = await fetch('/api/admin/profile', {
            method: 'PUT',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Profile updated successfully', 'success');
        } else {
            showNotification(data.error || 'Failed to update profile', 'error');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Error updating profile', 'error');
    }
});

// Password form submission
document.getElementById('passwordForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    try {
        const response = await fetch('/api/admin/password', {
            method: 'PUT',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Password changed successfully', 'success');
            this.reset();
        } else {
            showNotification(data.error || 'Failed to change password', 'error');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showNotification('Error changing password', 'error');
    }
});

// Notification settings form submission
document.getElementById('notificationForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);

    try {
        const response = await fetch('/api/admin/notifications', {
            method: 'PUT',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Notification settings updated successfully', 'success');
        } else {
            showNotification(data.error || 'Failed to update notification settings', 'error');
        }
    } catch (error) {
        console.error('Error updating notification settings:', error);
        showNotification('Error updating notification settings', 'error');
    }
});

// Utility Functions
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = '/logout';
    }
}