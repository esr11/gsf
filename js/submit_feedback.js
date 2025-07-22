// Global variables to store selections
let selectedSubcity = null;
let selectedOffice = null;
let selectedEmployee = null;

// List of all subcities
const subcities = [
    { id: 'bole', name: 'Bole' },
    { id: 'kirkos', name: 'Kirkos' },
    { id: 'akaki', name: 'Akaki' },
    { id: 'arada', name: 'Arada' },
    { id: 'gullele', name: 'Gullele' },
    { id: 'kolfe', name: 'Kolfe' },
    { id: 'lideta', name: 'Lideta' },
    { id: 'nifasilk', name: 'Nifasilk' },
    { id: 'yeka', name: 'Yeka' },
    { id: 'addis', name: 'Addis Ketema' },
    { id: 'lemu', name: 'Lemu' }
];

// Function to handle subcity selection
function selectSubcity(subcityId) {
    selectedSubcity = subcityId;
    // Update step indicator
    document.querySelectorAll('.step')[0].classList.add('completed');
    document.querySelectorAll('.step')[1].classList.add('active');
    
    // Hide step 1 and show step 2
    document.getElementById('step1').style.display = 'none';
    document.getElementById('step2').style.display = 'block';
    
    // Load offices for the selected subcity
    loadOffices(subcityId);
}

// Function to load offices
function loadOffices(subcityId) {
    const officeList = document.getElementById('officeList');
    officeList.innerHTML = ''; // Clear existing content
    
    // This would be replaced with an API call in the real implementation
    const offices = [
        { id: 'admin', name: 'Administration Office' },
        { id: 'public', name: 'Public Service Office' },
        { id: 'revenue', name: 'Revenue Office' },
        { id: 'health', name: 'Health Office' },
        { id: 'education', name: 'Education Office' }
    ];
    
    offices.forEach(office => {
        const officeCard = document.createElement('div');
        officeCard.className = 'col-md-4 mb-3';
        officeCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${office.name}</h5>
                    <button class="btn btn-primary w-100" onclick="selectOffice('${office.id}')">Select</button>
                </div>
            </div>
        `;
        officeList.appendChild(officeCard);
    });
}

// Function to handle office selection
function selectOffice(officeId) {
    selectedOffice = officeId;
    // Update step indicator
    document.querySelectorAll('.step')[1].classList.add('completed');
    document.querySelectorAll('.step')[2].classList.add('active');
    
    // Hide step 2 and show step 3
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'block';
    
    // Load employees for the selected office
    loadEmployees(officeId);
}

// Function to load employees
function loadEmployees(officeId) {
    const employeeList = document.getElementById('employeeList');
    employeeList.innerHTML = ''; // Clear existing content
    
    // This would be replaced with an API call in the real implementation
    const employees = [
        { id: 'emp1', name: 'John Doe', position: 'Manager' },
        { id: 'emp2', name: 'Jane Smith', position: 'Officer' },
        { id: 'emp3', name: 'Mike Johnson', position: 'Clerk' }
    ];
    
    employees.forEach(employee => {
        const employeeCard = document.createElement('div');
        employeeCard.className = 'col-md-4 mb-3';
        employeeCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body">
                    <h5 class="card-title">${employee.name}</h5>
                    <p class="card-text">${employee.position}</p>
                    <button class="btn btn-primary w-100" onclick="selectEmployee('${employee.id}')">Select</button>
                </div>
            </div>
        `;
        employeeList.appendChild(employeeCard);
    });
}

// Function to handle employee selection
function selectEmployee(employeeId) {
    selectedEmployee = employeeId;
    // Update step indicator
    document.querySelectorAll('.step')[2].classList.add('completed');
    document.querySelectorAll('.step')[3].classList.add('active');
    
    // Hide step 3 and show step 4
    document.getElementById('step3').style.display = 'none';
    document.getElementById('step4').style.display = 'block';
}

// Function to go back to previous step
function goBack(step) {
    const currentStep = document.querySelectorAll('.step.active')[0];
    const currentStepNumber = parseInt(currentStep.textContent);
    
    if (currentStepNumber > 1) {
        // Update step indicator
        document.querySelectorAll('.step')[currentStepNumber - 1].classList.remove('active');
        document.querySelectorAll('.step')[currentStepNumber - 2].classList.add('active');
        document.querySelectorAll('.step')[currentStepNumber - 2].classList.remove('completed');
        
        // Hide current step and show previous step
        document.getElementById(`step${currentStepNumber}`).style.display = 'none';
        document.getElementById(`step${currentStepNumber - 1}`).style.display = 'block';
    }
}

// Handle feedback form submission
document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('feedbackTitle').value;
    const content = document.getElementById('feedbackContent').value;
    const userName = document.getElementById('userName').value;
    
    // Validate feedback content
    if (content.length < 10) {
        alert('Please provide more detailed feedback (minimum 10 characters)');
        return;
    }
    
    if (content.length > 1000) {
        alert('Feedback is too long (maximum 1000 characters)');
        return;
    }
    
    const feedbackData = {
        subcity: selectedSubcity,
        office: selectedOffice,
        employee: selectedEmployee,
        title: title,
        content: content,
        userName: userName
    };
    
    // Here you would typically send the feedback data to your backend
    console.log('Submitting feedback:', feedbackData);
    
    // Show success message and redirect
    alert('Thank you for your feedback!');
    window.location.href = 'home.html';
});

// Add back buttons to each step
document.addEventListener('DOMContentLoaded', function() {
    const steps = document.querySelectorAll('[id^="step"]');
    steps.forEach(step => {
        const stepNumber = parseInt(step.id.replace('step', ''));
        if (stepNumber > 1) {
            const backButton = document.createElement('button');
            backButton.className = 'btn btn-secondary mt-3';
            backButton.textContent = 'Back';
            backButton.onclick = function() { goBack(stepNumber); };
            step.appendChild(backButton);
        }
    });
}); 