# MAXX Energy Frontend-Backend Integration

This project connects the MAXX Energy frontend to the backend API using the ngrok tunnel URL.

## Backend API Endpoint

**Base URL:** `https://b5e776df14c2.ngrok-free.app`

### Available Endpoints

- `GET /health` - Health check
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/change-password` - Change password (requires JWT token)

## Project Structure

```
MAXX-Energy-Project/
├── api-config.js              # API configuration and utility functions
├── index.html                 # Main homepage
├── login.html                 # Login page
├── register.html              # Registration page
├── auth.js                    # Authentication functionality
├── auth-styles.css            # Styles for auth pages
├── style.css                  # Main styles
├── User Profile Page/
│   ├── index.html            # User profile page
│   ├── script.js             # Profile functionality with API integration
│   └── style.css             # Profile page styles
└── FAQ Page/
    ├── index.html            # FAQ page
    ├── script.js             # FAQ functionality
    └── style.css             # FAQ page styles
```

## Features

### Authentication System
- **User Registration**: Create new accounts with username, email, password, name, and employee ID
- **User Login**: Authenticate users and store JWT tokens
- **Password Change**: Change passwords for authenticated users
- **Logout**: Clear stored tokens and redirect to login

### User Profile Management
- **Editable Fields**: Name, email, location, about, and skills
- **Real-time Validation**: Email format validation and input restrictions
- **API Integration**: Ready for backend profile updates
- **Authentication Protection**: Profile page requires login

### API Integration
- **Centralized Configuration**: All API endpoints and settings in `api-config.js`
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Token Management**: Automatic JWT token storage and management
- **CORS Support**: Includes ngrok browser warning bypass

## How to Use

### 1. Start the Backend Server
Make sure your backend server is running and accessible via the ngrok URL.

### 2. Open the Frontend
Open `index.html` in a web browser to access the main page.

### 3. User Registration
1. Click "Register" in the navigation
2. Fill in all required fields (username, email, password, name, employee ID)
3. Submit the form to create a new account

### 4. User Login
1. Click "Login" in the navigation
2. Enter your username and password
3. Upon successful login, you'll be redirected to your profile page

### 5. Profile Management
1. Access your profile page (requires login)
2. Click the edit button (✏️) next to any field to modify it
3. Click the checkmark (✔️) to save changes
4. Use the logout button to sign out

### 6. Password Change
1. On the profile page, scroll to the "Change Password" section
2. Enter your old password and new password
3. Submit to change your password

## API Configuration

The API configuration is centralized in `api-config.js`:

```javascript
const API_CONFIG = {
    BASE_URL: 'https://b5e776df14c2.ngrok-free.app',
    ENDPOINTS: {
        HEALTH: '/health',
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        CHANGE_PASSWORD: '/auth/change-password'
    }
};
```

## Security Features

- **JWT Token Storage**: Secure token management using localStorage
- **Input Validation**: Client-side validation for all forms
- **Authentication Guards**: Protected routes require login
- **CORS Headers**: Proper headers for cross-origin requests

## Error Handling

The application includes comprehensive error handling:
- Network errors
- Authentication failures
- Validation errors
- User-friendly error messages

## Browser Compatibility

This frontend works with modern browsers that support:
- ES6+ JavaScript features
- Fetch API
- LocalStorage
- CSS Grid and Flexbox

## Development Notes

- The profile update functionality is currently simulated (shows success message)
- To implement real profile updates, add the appropriate API endpoint to the backend
- All API calls include proper error handling and loading states
- The application automatically redirects logged-in users to appropriate pages

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend includes proper CORS headers
2. **ngrok Browser Warning**: The app includes `ngrok-skip-browser-warning` header
3. **Token Expiration**: Users will be redirected to login if tokens are invalid
4. **Network Issues**: Check that the ngrok URL is active and accessible

### Debug Mode

Open browser developer tools to see:
- API request/response details
- Console error messages
- Network request status
- LocalStorage token status
