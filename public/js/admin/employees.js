// Function to add a new employee
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
            loadEmployees(); // Refresh the employee list
        } else {
            showNotification(data.error || 'Failed to add employee', 'error');
        }
    } catch (error) {
        console.error('Error adding employee:', error);
        showNotification('Error adding employee', 'error');
    }
}

// Function to load employees
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
                    <td>${employee.email}</td>
                    <td>${employee.department}</td>
                    <td>${employee.position}</td>
                    <td>${employee.status}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editEmployee(${employee.employee_id})">
                            Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${employee.employee_id})">
                            Delete
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

// Function to edit an employee
async function editEmployee(employeeId) {
    try {
        const response = await fetch(`/api/admin/employees/${employeeId}`);
        const data = await response.json();

        if (data.success) {
            const employee = data.employee;
            // Populate the edit form with employee data
            document.getElementById('editFirstName').value = employee.first_name;
            document.getElementById('editLastName').value = employee.last_name;
            document.getElementById('editEmail').value = employee.email;
            document.getElementById('editPhone').value = employee.phone;
            document.getElementById('editDepartment').value = employee.department;
            document.getElementById('editPosition').value = employee.position;
            document.getElementById('editEmployeeId').value = employee.employee_id_number;
            document.getElementById('editJoiningDate').value = employee.joining_date;
            document.getElementById('editDateOfBirth').value = employee.date_of_birth;
            document.getElementById('editGender').value = employee.gender;
            document.getElementById('editAddress').value = employee.address;
            document.getElementById('editEmergencyContact').value = employee.emergency_contact;
            document.getElementById('editEmergencyPhone').value = employee.emergency_phone;
            
            // Show the edit modal
            $('#editEmployeeModal').modal('show');
        }
    } catch (error) {
        console.error('Error loading employee details:', error);
        showNotification('Error loading employee details', 'error');
    }
}

// Function to update an employee
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
            loadEmployees(); // Refresh the employee list
        } else {
            showNotification(data.error || 'Failed to update employee', 'error');
        }
    } catch (error) {
        console.error('Error updating employee:', error);
        showNotification('Error updating employee', 'error');
    }
}

// Function to delete an employee
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
            loadEmployees(); // Refresh the employee list
        } else {
            showNotification(data.error || 'Failed to delete employee', 'error');
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        showNotification('Error deleting employee', 'error');
    }
}

// Function to show notifications
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Load employees when the page loads
document.addEventListener('DOMContentLoaded', loadEmployees); 