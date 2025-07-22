document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Login form submitted');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log(`Login attempt with email: ${email}`);
    
    try {
        console.log('Preparing login request...');
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        console.log(`Response status: ${response.status}`);
        const data = await response.json();
        console.log('Full response:', data);
        
        if (response.ok) {
            console.log('Login successful');
            // Store token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            
            // Redirect based on role
            if (data.role === 'system_admin') {
                window.location.href = '/system_admin.html';
            } else if (data.role === 'government_admin') {
                window.location.href = '/government_admin.html';
            } else if (data.role === 'user') {
                window.location.href = '/home.html';
            } else {
                console.error('Unknown role:', data.role);
                alert('Unknown user role');
            }
        } else {
            console.log(`Login failed: ${data.message}`);
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login');
    }
}); 