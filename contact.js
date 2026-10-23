// =====================================================
// contact.js - Logic for Contact Page
// =====================================================

// Check authentication status to adjust navigation bar
const authToken = localStorage.getItem("token");
const navAuthBtn = document.getElementById("navAuthBtn");
const navDashboardLink = document.getElementById("navDashboardLink");

if (!authToken) {
    // If not logged in, change button to "Login"
    navAuthBtn.innerText = "Login";
    navAuthBtn.className = "btn btn-primary";
    navDashboardLink.href = "index.html";
} else {
    navAuthBtn.innerText = "Logout";
    navAuthBtn.className = "btn btn-delete";
    navDashboardLink.href = "dashboard.html";
}

// DOM element references
const contactForm = document.getElementById("contactForm");
const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");
const contactMessage = document.getElementById("contactMessage");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const messageError = document.getElementById("messageError");
const contactSuccessMsg = document.getElementById("contactSuccessMsg");
const sendContactBtn = document.getElementById("sendContactBtn");

// Function to clear all validation error messages
function clearErrors() {
    nameError.innerText = "";
    emailError.innerText = "";
    messageError.innerText = "";
}

// =====================================================
// HTTP POST: SEND MESSAGE
// Sends message data via POST to DummyJSON posts/add endpoint
// =====================================================
async function sendMessage(name, email, message) {
    try {
        sendContactBtn.innerText = "Sending...";
        sendContactBtn.disabled = true;

        // POST request to DummyJSON endpoint (simulating message delivery)
        const response = await fetch("https://dummyjson.com/posts/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: "Contact from " + name,
                body: "Email: " + email + " | Message: " + message,
                userId: 1,
                tags: ["contact"]
            })
        });

        if (response.ok) {
            // Show green success message
            contactSuccessMsg.style.display = "block";

            // Reset form fields
            contactName.value = "";
            contactEmail.value = "";
            contactMessage.value = "";

            // Hide success message after 4 seconds
            setTimeout(function () {
                contactSuccessMsg.style.display = "none";
            }, 4000);
        } else {
            alert("Failed to send message. Please try again.");
        }
    } catch (error) {
        console.error("Contact Form Error:", error);
        alert("Network error. Please check your connection.");
    } finally {
        sendContactBtn.innerText = "Send Message (POST)";
        sendContactBtn.disabled = false;
    }
}

// =====================================================
// BUTTON EVENT LISTENER: Contact Form Submission
// What button: "Send Message (POST)" button
// What happens: Validates fields (name >= 3 chars, email with @ and ., message >= 10 chars),
//               then sends a POST request using sendMessage().
// =====================================================
contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Clear old errors
    clearErrors();

    const nameValue = contactName.value.trim();
    const emailValue = contactEmail.value.trim();
    const messageValue = contactMessage.value.trim();

    let isValid = true;

    // Validate Name (minimum 3 characters)
    if (nameValue === "") {
        nameError.innerText = "Name is required";
        isValid = false;
    } else if (nameValue.length < 3) {
        nameError.innerText = "Name must be at least 3 characters";
        isValid = false;
    }

    // Validate Email (must contain '@' and '.')
    if (emailValue === "") {
        emailError.innerText = "Email is required";
        isValid = false;
    } else if (emailValue.indexOf("@") === -1 || emailValue.indexOf(".") === -1) {
        emailError.innerText = "Email must contain '@' and '.'";
        isValid = false;
    }

    // Validate Message (minimum 10 characters)
    if (messageValue === "") {
        messageError.innerText = "Message is required";
        isValid = false;
    } else if (messageValue.length < 10) {
        messageError.innerText = "Message must be at least 10 characters";
        isValid = false;
    }

    // If valid, submit message
    if (isValid) {
        sendMessage(nameValue, emailValue, messageValue);
    }
});

// =====================================================
// BUTTON EVENT LISTENER: Navigation Auth Button
// What button: "Logout" or "Login" button in top nav bar
// What happens: If user is logged in, clears localStorage and redirects to index.html.
//               If user is logged out, simply redirects to index.html.
// =====================================================
navAuthBtn.addEventListener("click", function () {
    if (authToken) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
    }
    window.location.href = "index.html";
});
