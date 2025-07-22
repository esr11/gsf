let allData = null;
let selectedSubcityId = '';
let selectedOfficeId = '';

document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    setupFilters();
    renderEmployees();
});

async function loadData() {
    const response = await fetch('/api/employees/grouped');
    const data = await response.json();
    if (!data.success) {
        alert('Failed to load employees');
        return;
    }
    allData = data.data;
    populateSubcityFilter();
}

function populateSubcityFilter() {
    const subcityFilter = document.getElementById('subcityFilter');
    subcityFilter.innerHTML = '<option value="">All Subcities</option>';
    allData.forEach(subcity => {
        subcityFilter.innerHTML += `<option value="${subcity.subcity_id}">${subcity.subcity_name}</option>`;
    });
}

function populateOfficeFilter(subcityId) {
    const officeFilter = document.getElementById('officeFilter');
    officeFilter.innerHTML = '<option value="">All Offices</option>';
    officeFilter.disabled = !subcityId;
    if (!subcityId) return;
    const subcity = allData.find(s => s.subcity_id == subcityId);
    if (subcity) {
        subcity.offices.forEach(office => {
            officeFilter.innerHTML += `<option value="${office.office_id}">${office.office_name}</option>`;
        });
    }
}

function setupFilters() {
    document.getElementById('subcityFilter').addEventListener('change', function() {
        selectedSubcityId = this.value;
        populateOfficeFilter(selectedSubcityId);
        selectedOfficeId = '';
        document.getElementById('officeFilter').value = '';
        renderEmployees();
    });
    document.getElementById('officeFilter').addEventListener('change', function() {
        selectedOfficeId = this.value;
        renderEmployees();
    });
}

function renderEmployees() {
    const container = document.getElementById('subcitiesGrid');
    container.innerHTML = '';
    let filtered = allData;
    if (selectedSubcityId) {
        filtered = filtered.filter(s => s.subcity_id == selectedSubcityId);
    }
    filtered.forEach(subcity => {
        let offices = subcity.offices;
        if (selectedOfficeId) {
            offices = offices.filter(o => o.office_id == selectedOfficeId);
        }
        offices.forEach(office => {
            office.employees.forEach(emp => {
                const card = document.createElement('div');
                card.className = 'employee-card';
                card.innerHTML = `
                  <img src="${emp.photo_url || 'images/default-avatar.png'}" 
                       alt="${emp.full_name}" 
                       onerror="this.src='images/default-avatar.png'">
                  <h5>${emp.full_name}</h5>
                  <p><strong>Role:</strong> ${emp.position}</p>
                  <p><strong>Office:</strong> ${office.office_name}</p>
                  <p><strong>Subcity:</strong> ${subcity.subcity_name}</p>
                  <a href="feedback.html?employee_id=${emp.employee_id}&employee_name=${encodeURIComponent(emp.full_name)}" 
                     class="btn btn-primary">
                     <i class="fas fa-comment me-2"></i>Give Feedback
                  </a>
                `;
                container.appendChild(card);
            });
        });
    });
}


