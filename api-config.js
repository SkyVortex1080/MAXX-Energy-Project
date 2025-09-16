// API Configuration for MAXX Energy Project
console.log('API Config loaded successfully');

const API_CONFIG = {
    BASE_URL: 'https://b5e776df14c2.ngrok-free.app',
    ENDPOINTS: {
        HEALTH: '/health',
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        CHANGE_PASSWORD: '/auth/change-password'
    },
    HEADERS: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true' // Skip ngrok browser warning
    }
};

// Utility function to make API calls
async function apiCall(endpoint, method = 'GET', data = null, token = null) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    const options = {
        method: method,
        headers: { ...API_CONFIG.HEADERS }
    };

    // Add authorization header if token is provided
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    // Add body for POST/PUT requests
    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    console.log('Making API call:', { url, method, data, headers: options.headers });

    try {
        const response = await fetch(url, options);
        
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await response.text();
            console.error('Non-JSON response received:', textResponse.substring(0, 200));
            throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
        }
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        console.log('API call successful:', jsonData);
        return jsonData;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Authentication functions
const authAPI = {
    async register(userData) {
        return await apiCall(API_CONFIG.ENDPOINTS.REGISTER, 'POST', userData);
    },

    async login(credentials) {
        return await apiCall(API_CONFIG.ENDPOINTS.LOGIN, 'POST', credentials);
    },

    async changePassword(oldPassword, newPassword, token) {
        return await apiCall(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, 'POST', {
            oldPassword,
            newPassword
        }, token);
    },

    async checkHealth() {
        return await apiCall(API_CONFIG.ENDPOINTS.HEALTH);
    }
};

// Token management
const tokenManager = {
    setToken(token) {
        localStorage.setItem('maxx_energy_token', token);
    },

    getToken() {
        return localStorage.getItem('maxx_energy_token');
    },

    removeToken() {
        localStorage.removeItem('maxx_energy_token');
    },

    isLoggedIn() {
        return !!this.getToken();
    }
};

// Test backend connectivity
async function testBackendConnection() {
    try {
        console.log('Testing backend connection...');
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
            headers: {
                'ngrok-skip-browser-warning': 'true'
            }
        });
        
        console.log('Health check response status:', response.status);
        const contentType = response.headers.get('content-type');
        console.log('Health check content-type:', contentType);
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Backend is accessible:', data);
            return true;
        } else {
            const text = await response.text();
            console.error('Backend returned non-JSON:', text.substring(0, 200));
            return false;
        }
    } catch (error) {
        console.error('Backend connection test failed:', error);
        return false;
    }
}

// Auto-test connection when script loads
testBackendConnection();