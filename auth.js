// Authentication functionality for MAXX Energy
console.log('Auth script loaded successfully');

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const messageDiv = document.getElementById('message');

    // Show message function
    function showMessage(message, type = 'error') {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type} show`;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.classList.remove('show');
        }, 5000);
    }

    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (!username || !password) {
                showMessage('Please fill in all fields', 'error');
                return;
            }

            try {
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Logging in...';

                console.log('Attempting login with:', { username });
                const response = await authAPI.login({ username, password });
                console.log('Login response:', response);
                
                // Handle different response formats
                let token = null;
                if (response.token) {
                    token = response.token;
                } else if (response.data && response.data.token) {
                    token = response.data.token;
                } else if (response.access_token) {
                    token = response.access_token;
                } else if (response.jwt) {
                    token = response.jwt;
                }
                
                if (token) {
                    tokenManager.setToken(token);
                    showMessage('Login successful! Redirecting...', 'success');
                    
                    // Redirect to user profile after successful login
                    setTimeout(() => {
                        window.location.href = 'User Profile Page/index.html';
                    }, 1500);
                } else {
                    console.error('No token found in response:', response);
                    showMessage('Login failed. Invalid response from server.', 'error');
                }
            } catch (error) {
                console.error('Login error:', error);
                
                // Provide more specific error messages
                let errorMessage = 'Login failed. Please try again.';
                
                if (error.name === 'AbortError') {
                    errorMessage = 'Login request timed out. Please check your connection and try again.';
                } else if (error.message.includes('non-JSON response')) {
                    errorMessage = 'Server is not responding properly. Please check if your backend is running.';
                } else if (error.message.includes('Failed to fetch')) {
                    errorMessage = 'Cannot connect to server. Please check your internet connection and backend status.';
                } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                    errorMessage = 'Invalid username or password. Please check your credentials.';
                } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
                    errorMessage = 'Access denied. Please contact your administrator.';
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                showMessage(errorMessage, 'error');
            } finally {
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login';
            }
        });
    }

    // Register form handler
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const name = document.getElementById('name').value;
            const employeeId = document.getElementById('employeeId').value;
            
            if (!username || !email || !password || !name || !employeeId) {
                showMessage('Please fill in all fields', 'error');
                return;
            }

            // Basic email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }

            // Password strength check
            if (password.length < 6) {
                showMessage('Password must be at least 6 characters long', 'error');
                return;
            }

            try {
                const submitBtn = registerForm.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Creating Account...';

                const userData = {
                    username,
                    email,
                    password,
                    name,
                    employeeId
                };

                console.log('Attempting to register user:', userData);
                const response = await authAPI.register(userData);
                
                if (response.message || response.success) {
                    showMessage('Registration successful! Please login.', 'success');
                    
                    // Redirect to login page after successful registration
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    showMessage('Registration failed. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Registration error:', error);
                
                // Provide more specific error messages
                let errorMessage = 'Registration failed. Please try again.';
                
                if (error.message.includes('non-JSON response')) {
                    errorMessage = 'Server is not responding properly. Please check if your backend is running.';
                } else if (error.message.includes('Failed to fetch')) {
                    errorMessage = 'Cannot connect to server. Please check your internet connection and backend status.';
                } else if (error.message.includes('Username')) {
                    errorMessage = 'Username may already be taken. Please try a different username.';
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                showMessage(errorMessage, 'error');
            } finally {
                const submitBtn = registerForm.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Register';
            }
        });
    }

    // Check if user is already logged in
    if (tokenManager.isLoggedIn()) {
        // If on login/register page and already logged in, redirect to profile
        if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
            window.location.href = 'User Profile Page/index.html';
        }
    }
});