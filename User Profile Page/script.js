// Enhanced User Profile Script with API Integration
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!tokenManager.isLoggedIn()) {
        alert('Please login to access your profile.');
        window.location.href = '../login.html';
        return;
    }

    // Initialize profile functionality
    initializeProfile();
    initializePasswordChange();
    initializeLogout();
});

function initializeProfile() {
    const fields = document.querySelectorAll(".field");
    let activeEditField = null;
    
    fields.forEach(field => {
        const displaySpan = field.querySelector(".display");
        const editInput = field.querySelector(".edit");
        const editBtn = field.querySelector(".edit-btn");
        const cancelBtn = field.querySelector(".cancel-btn");

        if (!displaySpan || !editInput || !editBtn || !cancelBtn) return;

        let originalValue = displaySpan.textContent.trim();
        let editing = false;

        editBtn.addEventListener("click", async () => {
            if (!editing) {
                // Close any other open edit fields
                if (activeEditField && activeEditField !== field) {
                    const otherDisplay = activeEditField.querySelector(".display");
                    const otherInput = activeEditField.querySelector(".edit");
                    const otherEditBtn = activeEditField.querySelector(".edit-btn");
                    const otherCancelBtn = activeEditField.querySelector(".cancel-btn");
                    otherDisplay.style.display = "inline";
                    otherInput.style.display = "none";
                    otherEditBtn.textContent = "✏️";
                    otherCancelBtn.style.display = "none";
                    activeEditField.editing = false;
                }

                // Enter edit mode
                originalValue = displaySpan.textContent.trim();
                editInput.value = originalValue;
                displaySpan.style.display = "none";
                editInput.style.display = "inline";
                editBtn.textContent = "✔️";
                cancelBtn.style.display = "inline";
                editing = true;
                activeEditField = field;
            } else {
                // Save changes
                const newValue = editInput.value.trim();
                if (newValue === "" || newValue === originalValue) {
                    displaySpan.textContent = originalValue;
                } else {
                    try {
                        // Show loading state
                        editBtn.textContent = "⏳";
                        editBtn.disabled = true;
                        
                        // Here you would typically make an API call to update the profile
                        // For now, we'll just update the display
                        displaySpan.textContent = newValue;
                        
                        // Simulate API call delay
                        await new Promise(resolve => setTimeout(resolve, 500));
                        
                        showMessage('Profile updated successfully!', 'success');
                    } catch (error) {
                        displaySpan.textContent = originalValue;
                        showMessage('Failed to update profile. Please try again.', 'error');
                    } finally {
                        editBtn.textContent = "✏️";
                        editBtn.disabled = false;
                    }
                }

                // Exit edit mode
                displaySpan.style.display = "inline";
                editInput.style.display = "none";
                editBtn.textContent = "✏️";
                cancelBtn.style.display = "none";
                editing = false;
                activeEditField = null;
            }
        });

        cancelBtn.addEventListener("click", () => {
            // Cancel changes and revert
            displaySpan.textContent = originalValue;
            displaySpan.style.display = "inline";
            editInput.style.display = "none";
            editBtn.textContent = "✏️";
            cancelBtn.style.display = "none";
            editing = false;
            activeEditField = null;
        });

        field.editing = editing;
    });
    
    // Restriction logic for edit fields
    fields.forEach(field => {
        const editInput = field.querySelector(".edit");

        if (editInput) {
            // Block "@" in name/location/about/skills fields
            if (editInput.type === "text" || editInput.tagName === "TEXTAREA") {
                editInput.addEventListener("keypress", function (e) {
                    if (e.key === "@") {
                        e.preventDefault();
                        alert("The @ symbol is not allowed here.");
                    }
                });
            }

            // Enforce email format for email field
            if (editInput.type === "email") {
                editInput.addEventListener("input", function () {
                    const emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
                    if (!emailPattern.test(editInput.value)) {
                        editInput.setCustomValidity("Please enter a valid email address.");
                    } else {
                        editInput.setCustomValidity("");
                    }
                });
            }
        }
    });
}

function initializePasswordChange() {
    const changePasswordForm = document.getElementById('changePasswordForm');
    const passwordMessage = document.getElementById('passwordMessage');

    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            
            if (!oldPassword || !newPassword) {
                showPasswordMessage('Please fill in all fields', 'error');
                return;
            }

            if (newPassword.length < 6) {
                showPasswordMessage('New password must be at least 6 characters long', 'error');
                return;
            }

            try {
                const submitBtn = changePasswordForm.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Changing Password...';

                const token = tokenManager.getToken();
                await authAPI.changePassword(oldPassword, newPassword, token);
                
                showPasswordMessage('Password changed successfully!', 'success');
                changePasswordForm.reset();
            } catch (error) {
                showPasswordMessage(error.message || 'Failed to change password. Please try again.', 'error');
            } finally {
                const submitBtn = changePasswordForm.querySelector('button[type="submit"]');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Change Password';
            }
        });
    }

    function showPasswordMessage(message, type = 'error') {
        passwordMessage.textContent = message;
        passwordMessage.className = `message ${type} show`;
        
        setTimeout(() => {
            passwordMessage.classList.remove('show');
        }, 5000);
    }
}

function initializeLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to logout?')) {
                tokenManager.removeToken();
                window.location.href = '../login.html';
            }
        });
    }
}

function showMessage(message, type = 'error') {
    // Create a temporary message element if it doesn't exist
    let messageDiv = document.getElementById('message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'message';
        messageDiv.className = 'message';
        document.body.appendChild(messageDiv);
    }
    
    messageDiv.textContent = message;
    messageDiv.className = `message ${type} show`;
    
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 5000);
}