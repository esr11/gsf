// Utility function to show notifications
function showNotification(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.querySelector('.main-content').insertBefore(alertDiv, document.querySelector('.main-content').firstChild);
    setTimeout(() => alertDiv.remove(), 5000);
}

// Function to show different sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('main > div').forEach(div => {
        div.style.display = 'none';
    });

    // Show selected section
    document.getElementById(sectionId).style.display = 'block';

    // Update active state in sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[onclick="showSection('${sectionId}')"]`).classList.add('active');

    // Load section-specific data
    if (sectionId === 'dashboard') {
        loadDashboardData();
    } else if (sectionId === 'government-admins') {
        loadGovernmentAdmins();
    } else if (sectionId === 'users') {
        loadAllUsers();
    } else if (sectionId === 'settings') {
        loadSystemAdminProfile();
        loadSystemAdminSettings();
    }
}

// Function to load dashboard data
function loadDashboardData() {
    const token = localStorage.getItem('token');
    if (!token) {
        showNotification('Authentication required. Please log in again.', 'error');
        return;
    }

    // Load user statistics
    fetch('/api/system-admin/dashboard/stats', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load dashboard stats');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            document.getElementById('totalUsers').textContent = data.stats.total_users;
            document.getElementById('totalGovAdmins').textContent = data.stats.total_gov_admins;
            document.getElementById('totalRegularUsers').textContent = data.stats.total_regular_users;
        } else {
            showNotification(data.message || 'Error loading dashboard statistics', 'error');
        }
    })
    .catch(error => {
        console.error('Error loading dashboard stats:', error);
        showNotification('Error loading dashboard statistics', 'error');
    });

    // Load recent activity
    fetch('/api/system-admin/dashboard/activity', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load recent activity');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            const activityTable = document.getElementById('recentActivity');
            activityTable.innerHTML = data.activities.map(activity => `
                <tr>
                    <td>${activity.user_name}</td>
                    <td>${activity.action}</td>
                    <td>${new Date(activity.timestamp).toLocaleString()}</td>
                </tr>
            `).join('');
        } else {
            showNotification(data.message || 'Error loading recent activity', 'error');
        }
    })
    .catch(error => {
        console.error('Error loading recent activity:', error);
        showNotification('Error loading recent activity', 'error');
    });
}

// Function to create a new government admin
function createGovernmentAdmin() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!fullName || !email || !password) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    const adminData = {
        full_name: fullName,
        email: email,
        password: password
    };

    const token = localStorage.getItem('token');
    fetch('/api/system-admin/government-admins', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(adminData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Government admin created successfully');
            const modal = bootstrap.Modal.getInstance(document.getElementById('newGovAdminModal'));
            modal.hide();
            document.getElementById('newGovAdminForm').reset();
            loadGovernmentAdmins();
        } else {
            showNotification(data.message || 'Error creating government admin', 'error');
        }
    })
    .catch(error => {
        console.error('Error creating government admin:', error);
        showNotification('Error creating government admin', 'error');
    });
}

// Function to load government admins
function loadGovernmentAdmins() {
    const token = localStorage.getItem('token');
    fetch('/api/system-admin/government-admins', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const tableBody = document.querySelector('#govAdminsTable tbody');
            tableBody.innerHTML = data.admins.map(admin => `
                <tr>
                    <td>${admin.user_id}</td>
                    <td>${admin.email}</td>
                    <td>${admin.full_name || 'N/A'}</td>
                    <td><span class="badge bg-success">Active</span></td>
                    <td>${new Date(admin.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editGovernmentAdmin(${admin.user_id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteGovernmentAdmin(${admin.user_id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            showNotification(data.message || 'Error loading government admins', 'error');
        }
    })
    .catch(error => {
        console.error('Error loading government admins:', error);
        showNotification('Error loading government admins', 'error');
    });
}

// Function to delete a government admin
function deleteGovernmentAdmin(userId) {
    if (confirm('Are you sure you want to delete this government admin?')) {
        const token = localStorage.getItem('token');
        fetch(`/api/system-admin/government-admins/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Government admin deleted successfully');
                loadGovernmentAdmins();
            } else {
                showNotification(data.message || 'Error deleting government admin', 'error');
            }
        })
        .catch(error => {
            console.error('Error deleting government admin:', error);
            showNotification('Error deleting government admin', 'error');
        });
    }
}

// Function to edit a government admin
function editGovernmentAdmin(userId) {
    const token = localStorage.getItem('token');
    fetch(`/api/system-admin/government-admins/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('editUserId').value = data.admin.user_id;
            document.getElementById('editFullName').value = data.admin.full_name;
            document.getElementById('editEmail').value = data.admin.email;
            document.getElementById('editPassword').value = '';
            document.getElementById('editConfirmPassword').value = '';

            const editModal = new bootstrap.Modal(document.getElementById('editGovAdminModal'));
            editModal.show();
        } else {
            showNotification(data.message || 'Error loading government admin details', 'error');
        }
    })
    .catch(error => {
        console.error('Error loading government admin details:', error);
        showNotification('Error loading government admin details', 'error');
    });
}

// Function to update a government admin
function updateGovernmentAdmin() {
    const userId = document.getElementById('editUserId').value;
    const fullName = document.getElementById('editFullName').value;
    const email = document.getElementById('editEmail').value;
    const password = document.getElementById('editPassword').value;
    const confirmPassword = document.getElementById('editConfirmPassword').value;

    if (!fullName || !email) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (password && password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    const updateData = {
        full_name: fullName,
        email: email
    };

    if (password) {
        updateData.password = password;
    }

    const token = localStorage.getItem('token');
    fetch(`/api/system-admin/government-admins/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Government admin updated successfully');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editGovAdminModal'));
            modal.hide();
            document.getElementById('editGovAdminForm').reset();
            loadGovernmentAdmins();
        } else {
            showNotification(data.message || 'Error updating government admin', 'error');
        }
    })
    .catch(error => {
        console.error('Error updating government admin:', error);
        showNotification('Error updating government admin', 'error');
    });
}

// Function to load all users
function loadAllUsers() {
    const token = localStorage.getItem('token');
    fetch('/api/system-admin/users', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const tableBody = document.getElementById('usersList');
            tableBody.innerHTML = data.users.map(user => `
                <tr>
                    <td>${user.user_id}</td>
                    <td>${user.full_name || 'N/A'}</td>
                    <td>${user.email}</td>
                    <td><span class="badge ${getRoleBadgeClass(user.role)}">${user.role}</span></td>
                    <td>${new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editUser(${user.user_id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.user_id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        } else {
            showNotification(data.message || 'Error loading users', 'error');
        }
    })
    .catch(error => {
        console.error('Error loading users:', error);
        showNotification('Error loading users', 'error');
    });
}

// Function to get badge class based on role
function getRoleBadgeClass(role) {
    switch (role.toLowerCase()) {
        case 'system_admin':
            return 'bg-danger';
        case 'government_admin':
            return 'bg-warning';
        case 'user':
            return 'bg-info';
        default:
            return 'bg-secondary';
    }
}

// Function to delete a user
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        const token = localStorage.getItem('token');
        fetch(`/api/system-admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('User deleted successfully');
                loadAllUsers();
            } else {
                showNotification(data.message || 'Error deleting user', 'error');
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            showNotification('Error deleting user', 'error');
        });
    }
}

// Function to edit a user
function editUser(userId) {
    const token = localStorage.getItem('token');
    fetch(`/api/system-admin/users/${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('editUserId').value = data.user.user_id;
            document.getElementById('editFullName').value = data.user.full_name;
            document.getElementById('editEmail').value = data.user.email;
            document.getElementById('editPassword').value = '';
            document.getElementById('editConfirmPassword').value = '';

            const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
            editModal.show();
        } else {
            showNotification(data.message || 'Error loading user details', 'error');
        }
    })
    .catch(error => {
        console.error('Error loading user details:', error);
        showNotification('Error loading user details', 'error');
    });
}

// Function to update a user
function updateUser() {
    const userId = document.getElementById('editUserId').value;
    const fullName = document.getElementById('editFullName').value;
    const email = document.getElementById('editEmail').value;
    const password = document.getElementById('editPassword').value;
    const confirmPassword = document.getElementById('editConfirmPassword').value;

    if (!fullName || !email) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (password && password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    const updateData = {
        full_name: fullName,
        email: email
    };

    if (password) {
        updateData.password = password;
    }

    const token = localStorage.getItem('token');
    fetch(`/api/system-admin/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('User updated successfully');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            modal.hide();
            document.getElementById('editUserForm').reset();
            loadAllUsers();
        } else {
            showNotification(data.message || 'Error updating user', 'error');
        }
    })
    .catch(error => {
        console.error('Error updating user:', error);
        showNotification('Error updating user', 'error');
    });
}

// Function to load system admin profile
function loadSystemAdminProfile() {
    const token = localStorage.getItem('token');
    fetch('/api/system-admin/profile', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('adminName').textContent = data.user.email;
            document.getElementById('profileFullName').value = data.user.email;
            document.getElementById('profileEmail').value = data.user.email;
        } else {
            showNotification(data.message || 'Error loading profile', 'error');
        }
    })
    .catch(error => {
        console.error('Error loading system admin profile:', error);
        showNotification('Error loading profile', 'error');
    });
}

// Function to update system admin profile
function updateProfile() {
    const token = localStorage.getItem('token');
    const fullName = document.getElementById('profileFullName').value;
    const email = document.getElementById('profileEmail').value;

    if (!fullName || !email) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    fetch('/api/system-admin/profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            full_name: fullName,
            email: email
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Profile updated successfully');
            loadSystemAdminProfile(); // Reload profile to update sidebar
        } else {
            showNotification(data.message || 'Error updating profile', 'error');
        }
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        showNotification('Error updating profile', 'error');
    });
}

// Function to change system admin password
function changePassword() {
    const token = localStorage.getItem('token');
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        showNotification('Please fill in all password fields', 'error');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }

    fetch('/api/system-admin/profile/password', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Password changed successfully');
            document.getElementById('changePasswordForm').reset();
        } else {
            showNotification(data.message || 'Error changing password', 'error');
        }
    })
    .catch(error => {
        console.error('Error changing password:', error);
        showNotification('Error changing password', 'error');
    });
}

// Function to load system admin settings
function loadSystemAdminSettings() {
    const token = localStorage.getItem('token');
    fetch('/api/system-admin/settings', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('emailNotifications').checked = data.settings.email_notifications || false;
            document.getElementById('systemNotifications').checked = data.settings.system_notifications || false;
            document.getElementById('timezone').value = data.settings.timezone || 'UTC';
            document.getElementById('dateFormat').value = data.settings.date_format || 'YYYY-MM-DD';
        } else {
            showNotification(data.message || 'Error loading settings', 'error');
        }
    })
    .catch(error => {
        console.error('Error loading settings:', error);
        showNotification('Error loading settings', 'error');
    });
}

// Function to update notification settings
function updateNotificationSettings() {
    const token = localStorage.getItem('token');
    const emailNotifications = document.getElementById('emailNotifications').checked;
    const systemNotifications = document.getElementById('systemNotifications').checked;

    fetch('/api/system-admin/settings', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            email_notifications: emailNotifications,
            system_notifications: systemNotifications,
            timezone: document.getElementById('timezone').value,
            date_format: document.getElementById('dateFormat').value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Settings updated successfully');
        } else {
            showNotification(data.message || 'Error updating settings', 'error');
        }
    })
    .catch(error => {
        console.error('Error updating settings:', error);
        showNotification('Error updating settings', 'error');
    });
}

// Function to update system preferences
function updateSystemPreferences() {
    const token = localStorage.getItem('token');
    const timezone = document.getElementById('timezone').value;
    const dateFormat = document.getElementById('dateFormat').value;

    fetch('/api/system-admin/settings', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            email_notifications: document.getElementById('emailNotifications').checked,
            system_notifications: document.getElementById('systemNotifications').checked,
            timezone: timezone,
            date_format: dateFormat
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification('Preferences updated successfully');
        } else {
            showNotification(data.message || 'Error updating preferences', 'error');
        }
    })
    .catch(error => {
        console.error('Error updating preferences:', error);
        showNotification('Error updating preferences', 'error');
    });
}

// Load initial data when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSystemAdminProfile();
    loadDashboardData();
});