// =====================================================
// login.js - Logic for Student Login Page
// =====================================================

// Check if user is already logged in, redirect straight to dashboard
const existingToken = localStorage.getItem("token");
if (existingToken) {
    window.location.href = "dashboard.html";
}

// Get references to HTML input elements and error containers
const loginForm = document.getElementById("loginForm");
const roleSelect = document.getElementById("roleSelect");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");

const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");
const loginGeneralError = document.getElementById("loginGeneralError");
const loginSubmitBtn = document.getElementById("loginSubmitBtn");

// Helper function to clear previous error messages
function clearErrors() {
    usernameError.innerText = "";
    passwordError.innerText = "";
    loginGeneralError.innerText = "";
}

// Function that handles the login API call
async function handleLogin(username, password) {
    try {
        // Indicate to the user that request is processing
        loginSubmitBtn.innerText = "Logging in...";
        loginSubmitBtn.disabled = true;

        // POST request to DummyJSON authentication endpoint
        const response = await fetch("https://dummyjson.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        // Parse response JSON
        const data = await response.json();

        // Check if login was successful
        if (response.ok) {
            // Save token, username, and selected role into browser's localStorage
            // DummyJSON returns 'accessToken' in recent versions and 'token' in older versions
            const tokenToSave = data.accessToken || data.token;
            const selectedRole = roleSelect ? roleSelect.value : "Student";
            localStorage.setItem("token", tokenToSave);
            localStorage.setItem("username", data.username);
            localStorage.setItem("userRole", selectedRole);

            // Redirect user to the complaints dashboard
            window.location.href = "dashboard.html";
        } else {
            // Show error message on invalid credentials
            loginGeneralError.innerText = "Wrong username or password";
        }
    } catch (error) {
        // Handle network connection errors
        console.error("Login Error:", error);
        loginGeneralError.innerText = "Unable to connect to server. Check internet connection.";
    } finally {
        // Reset button state
        loginSubmitBtn.innerText = "Log In";
        loginSubmitBtn.disabled = false;
    }
}

// =====================================================
// BUTTON EVENT LISTENER:
// Listen for form submission when "Log In" button is clicked.
// Validates username and password before sending API request.
// =====================================================
loginForm.addEventListener("submit", function (event) {
    // Prevent the default browser page reload on form submit
    event.preventDefault();

    // Clear old errors
    clearErrors();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    let isValid = true;

    // Validate username (not empty, at least 3 characters)
    if (username === "") {
        usernameError.innerText = "Username is required";
        isValid = false;
    } else if (username.length < 3) {
        usernameError.innerText = "Username must be at least 3 characters";
        isValid = false;
    }

    // Validate password (not empty, at least 6 characters)
    if (password === "") {
        passwordError.innerText = "Password is required";
        isValid = false;
    } else if (password.length < 6) {
        passwordError.innerText = "Password must be at least 6 characters";
        isValid = false;
    }

    // If validation passes, proceed to call the API
    if (isValid) {
        handleLogin(username, password);
    }
});
