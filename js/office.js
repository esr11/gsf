// Constants
const API_BASE_URL = '/api';
const TOKEN_KEY = 'token';

// Load offices when page loads
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const subcityId = urlParams.get('subcity_id');
    
    if (subcityId) {
        loadSubcityDetails(subcityId);
        loadOffices(subcityId);
    } else {
        alert('No subcity selected. Please go back and select a subcity.');
        window.location.href = 'subcity.html';
    }
});

// Load subcity details
async function loadSubcityDetails(subcityId) {
    try {
        const response = await fetch(`${API_BASE_URL}/subcity/${subcityId}`);

        if (!response.ok) {
            throw new Error('Failed to load subcity details');
        }

        const data = await response.json();
        const subcity = data.subcity;
    
    // Update page title and description
        document.querySelector('h1').textContent = `${subcity.subcity_name} Sub-City Administration`;
        document.querySelector('p.text-center').textContent = subcity.description || 'Select an office to view employees';

    } catch (error) {
        console.error('Error loading subcity details:', error);
        alert('Failed to load subcity details. Please try again.');
    }
}

// Load offices for the selected subcity
async function loadOffices(subcityId) {
    try {
        const response = await fetch(`${API_BASE_URL}/subcity/${subcityId}`);

        if (!response.ok) {
            throw new Error('Failed to load offices');
        }

        const data = await response.json();
        const offices = data.offices;

        // Update the offices container
        const container = document.querySelector('.row');
        container.innerHTML = offices.map(office => `
            <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 shadow">
                <div class="card-body">
                        <h5 class="card-title">${office.office_name}</h5>
                        <p class="card-text">Office administration</p>
                        <a href="profile.html?office_id=${office.office_id}" class="btn btn-primary">View Employees</a>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading offices:', error);
        alert('Failed to load offices. Please try again.');
    }
}

// Function to load subcities (for admin view)
async function loadSubcities() {
    try {
        const response = await fetch('/api/subcities');
        const data = await response.json();
        
        if (!data.success) {
            throw new Error('Failed to load subcities');
        }
        
        const subcityList = document.getElementById('subcityList');
        subcityList.innerHTML = '';
        
        data.subcities.forEach(subcity => {
            const subcityItem = document.createElement('div');
            subcityItem.className = 'col-md-4 mb-4';
            subcityItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${subcity.name}</h5>
                        <p class="card-text">${subcity.description}</p>
                        <button onclick="viewOffices('${subcity.subcity_id}', '${subcity.name}')" class="btn btn-primary">View Offices</button>
                    </div>
                </div>
            `;
            subcityList.appendChild(subcityItem);
        });
    } catch (error) {
        console.error('Error loading subcities:', error);
        alert('Error loading subcities. Please try again.');
    }
}

// Function to view offices for a subcity (admin view)
async function viewOffices(subcityId, subcityName) {
    try {
        const response = await fetch(`/api/subcities/${subcityId}/offices`);
        const data = await response.json();
        
        if (!data.success) {
            throw new Error('Failed to load offices');
        }
        
        const officeList = document.getElementById('officeList');
        officeList.innerHTML = '';
        
        data.offices.forEach(office => {
            const officeItem = document.createElement('div');
            officeItem.className = 'col-md-4 mb-4';
            officeItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${office.name}</h5>
                        <p class="card-text">${office.description || ''}</p>
                        <div class="btn-group">
                            <button onclick="editOffice('${office.office_id}')" class="btn btn-warning">Edit</button>
                            <button onclick="deleteOffice('${office.office_id}')" class="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            `;
            officeList.appendChild(officeItem);
        });
        
        document.getElementById('subcityName').textContent = subcityName;
        document.getElementById('officeList').style.display = 'block';
    } catch (error) {
        console.error('Error loading offices:', error);
        alert('Error loading offices. Please try again.');
    }
}

// Function to go back to subcities list
function backToSubcities() {
    document.getElementById('officeList').style.display = 'none';
    document.getElementById('subcityName').textContent = '';
}

// Function to edit an office
async function editOffice(officeId) {
    // Implementation for editing office
    console.log('Edit office:', officeId);
}

// Function to delete an office
async function deleteOffice(officeId) {
    if (confirm('Are you sure you want to delete this office?')) {
        try {
            const response = await fetch(`/api/offices/${officeId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            
            if (data.success) {
                alert('Office deleted successfully');
                // Refresh the office list
                const subcityId = sessionStorage.getItem('selectedSubcityId');
                viewOffices(subcityId);
            } else {
                throw new Error(data.message || 'Failed to delete office');
            }
        } catch (error) {
            console.error('Error deleting office:', error);
            alert('Error deleting office. Please try again.');
        }
    }
}
