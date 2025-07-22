// Constants
const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const API_BASE_URL = '/api';

// Chart instances
let ratingChart = null;
let statusChart = null;
let trendsChart = null;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }

    // Check if user is government admin
    if (user.role !== 'government_admin') {
        alert('Access denied. Only government administrators can access this page.');
        window.location.href = 'login.html';
        return;
    }

    // Initialize date range selector
    initializeDateRange();
    
    // Load initial data
    loadReports();
});

// Initialize date range selector
function initializeDateRange() {
    const dateRange = document.getElementById('dateRange');
    const customDateRange = document.getElementById('customDateRange');
    const customDateRangeEnd = document.getElementById('customDateRangeEnd');
    
    dateRange.addEventListener('change', function() {
        if (this.value === 'custom') {
            customDateRange.style.display = 'block';
            customDateRangeEnd.style.display = 'block';
        } else {
            customDateRange.style.display = 'none';
            customDateRangeEnd.style.display = 'none';
            loadReports();
        }
    });
    
    // Set default dates for custom range
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    document.getElementById('startDate').value = thirtyDaysAgo.toISOString().split('T')[0];
    document.getElementById('endDate').value = today.toISOString().split('T')[0];
    
    // Add change listeners to custom date inputs
    document.getElementById('startDate').addEventListener('change', loadReports);
    document.getElementById('endDate').addEventListener('change', loadReports);
}

// Load reports data
async function loadReports() {
    try {
        const dateRange = document.getElementById('dateRange').value;
        let startDate, endDate;
        
        if (dateRange === 'custom') {
            startDate = document.getElementById('startDate').value;
            endDate = document.getElementById('endDate').value;
        } else {
            const today = new Date();
            endDate = today.toISOString().split('T')[0];
            startDate = new Date(today);
            startDate.setDate(today.getDate() - parseInt(dateRange));
            startDate = startDate.toISOString().split('T')[0];
        }
        
        const response = await fetch(`${API_BASE_URL}/reports?start_date=${startDate}&end_date=${endDate}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load reports');
        
        const data = await response.json();
        
        // Update statistics
        updateStatistics(data.statistics);
        
        // Update charts
        updateCharts(data.charts);
        
        // Update tables
        updateTables(data.tables);
        
    } catch (error) {
        console.error('Error loading reports:', error);
        alert('Failed to load reports. Please try again.');
    }
}

// Update statistics
function updateStatistics(stats) {
    document.getElementById('totalFeedback').textContent = stats.total_feedback;
    document.getElementById('averageRating').textContent = stats.average_rating.toFixed(1);
    document.getElementById('resolvedFeedback').textContent = stats.resolved_feedback;
    document.getElementById('pendingFeedback').textContent = stats.pending_feedback;
}

// Update charts
function updateCharts(charts) {
    // Rating distribution chart
    if (ratingChart) ratingChart.destroy();
    ratingChart = new Chart(document.getElementById('ratingChart'), {
        type: 'bar',
        data: {
            labels: charts.rating.labels,
            datasets: [{
                label: 'Number of Feedback',
                data: charts.rating.data,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
    
    // Status distribution chart
    if (statusChart) statusChart.destroy();
    statusChart = new Chart(document.getElementById('statusChart'), {
        type: 'pie',
        data: {
            labels: charts.status.labels,
            datasets: [{
                data: charts.status.data,
                backgroundColor: [
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(255, 99, 132, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
    
    // Trends chart
    if (trendsChart) trendsChart.destroy();
    trendsChart = new Chart(document.getElementById('trendsChart'), {
        type: 'line',
        data: {
            labels: charts.trends.labels,
            datasets: [{
                label: 'Feedback Count',
                data: charts.trends.data,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Update tables
function updateTables(tables) {
    // Top performing offices
    const topOfficesTable = document.getElementById('topOfficesTable');
    topOfficesTable.innerHTML = tables.top_offices.map(office => `
        <tr>
            <td>${office.name}</td>
            <td>${office.subcity}</td>
            <td>${office.total_feedback}</td>
            <td>${office.average_rating.toFixed(1)}</td>
            <td>
                <div class="progress">
                    <div class="progress-bar bg-success" role="progressbar" 
                         style="width: ${office.performance}%" 
                         aria-valuenow="${office.performance}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                        ${office.performance}%
                    </div>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Employee performance
    const employeePerformanceTable = document.getElementById('employeePerformanceTable');
    employeePerformanceTable.innerHTML = tables.employee_performance.map(employee => `
        <tr>
            <td>${employee.name}</td>
            <td>${employee.office}</td>
            <td>${employee.total_feedback}</td>
            <td>${employee.average_rating.toFixed(1)}</td>
            <td>
                <div class="progress">
                    <div class="progress-bar bg-success" role="progressbar" 
                         style="width: ${employee.performance}%" 
                         aria-valuenow="${employee.performance}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                        ${employee.performance}%
                    </div>
                </div>
            </td>
        </tr>
    `).join('');
}

// Export to Excel
function exportToExcel() {
    const dateRange = document.getElementById('dateRange').value;
    let startDate, endDate;
    
    if (dateRange === 'custom') {
        startDate = document.getElementById('startDate').value;
        endDate = document.getElementById('endDate').value;
    } else {
        const today = new Date();
        endDate = today.toISOString().split('T')[0];
        startDate = new Date(today);
        startDate.setDate(today.getDate() - parseInt(dateRange));
        startDate = startDate.toISOString().split('T')[0];
    }
    
    window.location.href = `${API_BASE_URL}/reports/export/excel?start_date=${startDate}&end_date=${endDate}`;
}

// Export to PDF
function exportToPDF() {
    const dateRange = document.getElementById('dateRange').value;
    let startDate, endDate;
    
    if (dateRange === 'custom') {
        startDate = document.getElementById('startDate').value;
        endDate = document.getElementById('endDate').value;
    } else {
        const today = new Date();
        endDate = today.toISOString().split('T')[0];
        startDate = new Date(today);
        startDate.setDate(today.getDate() - parseInt(dateRange));
        startDate = startDate.toISOString().split('T')[0];
    }
    
    window.location.href = `${API_BASE_URL}/reports/export/pdf?start_date=${startDate}&end_date=${endDate}`;
} 