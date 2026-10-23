// =====================================================
// dashboard.js - Logic for Hostel Mess Complaints Portal
// =====================================================

// STEP 1: AUTHENTICATION CHECK
// If student is not logged in (no token found), redirect to login page
const userToken = localStorage.getItem("token");
if (!userToken) {
    window.location.href = "index.html";
}

// Display logged-in student username in greeting
const currentUsername = localStorage.getItem("username") || "Student";
document.getElementById("loggedInUserDisplay").innerText = currentUsername;

// Main in-memory array that holds our complaints list
let complaints = [];

// Track current user role: 'Student' or 'Warden'
let currentRole = localStorage.getItem("userRole") || "Student";

// DOM Element references
const complaintsTableBody = document.getElementById("complaintsTableBody");
const tableStatusMessage = document.getElementById("tableStatusMessage");
const addComplaintForm = document.getElementById("addComplaintForm");
const addComplaintHeading = document.getElementById("addComplaintHeading");
const complaintTitle = document.getElementById("complaintTitle");
const complaintCategory = document.getElementById("complaintCategory");
const complaintDescription = document.getElementById("complaintDescription");
const titleError = document.getElementById("titleError");
const categoryError = document.getElementById("categoryError");
const descriptionError = document.getElementById("descriptionError");
const addComplaintSuccess = document.getElementById("addComplaintSuccess");
const submitComplaintBtn = document.getElementById("submitComplaintBtn");

const userRoleBadge = document.getElementById("userRoleBadge");
const switchRoleBtn = document.getElementById("switchRoleBtn");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const resetDataBtn = document.getElementById("resetDataBtn");
const navLogoutBtn = document.getElementById("navLogoutBtn");

// =====================================================
// ROLE UI HELPER FUNCTION
// Updates role badge text, styling, and headings based on current role
// =====================================================
function updateRoleUI() {
    if (currentRole === "Warden") {
        userRoleBadge.className = "badge-role badge-role-warden";
        userRoleBadge.innerText = "Role: Mess Warden";
        switchRoleBtn.innerText = "⇄ Switch to Student";
        if (addComplaintHeading) {
            addComplaintHeading.innerText = "Add Official Mess Complaint / Notice (POST)";
        }
    } else {
        userRoleBadge.className = "badge-role badge-role-student";
        userRoleBadge.innerText = "Role: Student";
        switchRoleBtn.innerText = "⇄ Switch to Warden";
        if (addComplaintHeading) {
            addComplaintHeading.innerText = "Add New Complaint (POST)";
        }
    }
}

// =====================================================
// LOCAL STORAGE HELPER FUNCTION
// Saves the current JavaScript complaints array into localStorage as a JSON string
// =====================================================
function saveComplaintsToLocalStorage() {
    localStorage.setItem("complaints", JSON.stringify(complaints));
}

// =====================================================
// TABLE RENDERING FUNCTION
// Creates table rows dynamically from an array of complaints
// Uses createElement and addEventListener for each action button
// =====================================================
function renderTable(complaintList) {
    // Clear existing rows in the table body
    complaintsTableBody.innerHTML = "";

    // If there are no complaints to display, show "No complaints found"
    if (!complaintList || complaintList.length === 0) {
        tableStatusMessage.innerText = "No complaints found.";
        tableStatusMessage.style.display = "block";
        return;
    }

    // Hide the empty status message when complaints exist
    tableStatusMessage.style.display = "none";

    // Loop through each complaint in the list
    for (let i = 0; i < complaintList.length; i++) {
        const item = complaintList[i];

        // Create table row element: <tr>
        const row = document.createElement("tr");

        // Column 1: ID
        const idCell = document.createElement("td");
        idCell.innerText = item.id;
        row.appendChild(idCell);

        // Column 2: Title
        const titleCell = document.createElement("td");
        titleCell.innerText = item.title;
        row.appendChild(titleCell);

        // Column 3: Category badge
        const categoryCell = document.createElement("td");
        const categoryBadge = document.createElement("span");
        categoryBadge.className = "badge-category";
        categoryBadge.innerText = item.category || "other";
        categoryCell.appendChild(categoryBadge);
        row.appendChild(categoryCell);

        // Column 4: Description
        const descCell = document.createElement("td");
        descCell.innerText = item.body;
        row.appendChild(descCell);

        // Column 5: Status badge (Pending / Resolved)
        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");
        if (item.status === "Resolved") {
            statusBadge.className = "status-resolved";
            statusBadge.innerText = "Resolved";
        } else {
            statusBadge.className = "status-pending";
            statusBadge.innerText = "Pending";
        }
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        // Column 6: Action buttons (Resolve & Delete)
        const actionCell = document.createElement("td");
        actionCell.className = "action-buttons";

        // Create "Resolve" button
        const resolveButton = document.createElement("button");
        resolveButton.className = "btn btn-resolve";

        if (item.status === "Resolved") {
            resolveButton.innerText = "Resolved ✓";
            resolveButton.disabled = true;
            resolveButton.style.opacity = "0.6";
            resolveButton.style.cursor = "not-allowed";
        } else {
            if (currentRole === "Warden") {
                resolveButton.innerText = "Resolve (Warden)";
                resolveButton.title = "Mess Warden authority to resolve this complaint";
            } else {
                resolveButton.innerText = "Mark Resolved";
                resolveButton.title = "Student can mark their issue as resolved once satisfied";
            }

            // BUTTON EVENT LISTENER:
            // What button: "Resolve" button for a specific complaint row
            // What happens: Calls handleResolveComplaint with this complaint's ID to send a PUT request
            resolveButton.addEventListener("click", function () {
                handleResolveComplaint(item.id);
            });
        }
        actionCell.appendChild(resolveButton);

        // Create "Delete" button
        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-delete";
        deleteButton.innerText = "Delete";

        // BUTTON EVENT LISTENER:
        // What button: "Delete" button for a specific complaint row
        // What happens: Asks confirmation and sends a DELETE request to remove the complaint
        deleteButton.addEventListener("click", function () {
            handleDeleteComplaint(item.id);
        });
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        // Append completed row into the table body
        complaintsTableBody.appendChild(row);
    }
}

// =====================================================
// HTTP GET: LOAD COMPLAINTS FROM API
// Fetches initial complaints from DummyJSON posts endpoint
// =====================================================
async function loadComplaintsFromAPI() {
    try {
        tableStatusMessage.innerText = "Loading complaints from server...";
        tableStatusMessage.style.display = "block";
        complaintsTableBody.innerHTML = "";

        // Send GET request to DummyJSON
        const response = await fetch("https://dummyjson.com/posts?limit=15");
        const data = await response.json();

        // Map DummyJSON posts to our complaint objects
        const loadedList = [];
        for (let i = 0; i < data.posts.length; i++) {
            const post = data.posts[i];

            // Use first tag as category (or 'other' if none)
            let categoryName = "other";
            if (post.tags && post.tags.length > 0) {
                categoryName = post.tags[0];
            }

            loadedList.push({
                id: post.id,
                title: post.title,
                category: categoryName,
                body: post.body,
                status: "Pending" // Initial status managed locally
            });
        }

        // Save into our array and localStorage
        complaints = loadedList;
        saveComplaintsToLocalStorage();

        // Render the table
        renderTable(complaints);
    } catch (error) {
        console.error("Error loading complaints:", error);
        tableStatusMessage.innerText = "Failed to load complaints. Please check your internet.";
        tableStatusMessage.style.display = "block";
    }
}

// =====================================================
// HTTP PUT: RESOLVE COMPLAINT
// Updates complaint status to "Resolved"
// =====================================================
async function handleResolveComplaint(complaintId) {
    try {
        // Send PUT request to DummyJSON
        // DummyJSON simulates the update and responds with updated data
        await fetch("https://dummyjson.com/posts/" + complaintId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: "Resolved"
            })
        });

        // DummyJSON does not permanently save this on the server.
        // Therefore, we update our local JavaScript array and save to localStorage!
        for (let i = 0; i < complaints.length; i++) {
            if (complaints[i].id === complaintId) {
                complaints[i].status = "Resolved";
                break;
            }
        }

        saveComplaintsToLocalStorage();
        renderTable(complaints);
    } catch (error) {
        console.error("Error resolving complaint:", error);
        alert("An error occurred while resolving the complaint.");
    }
}

// =====================================================
// HTTP DELETE: DELETE COMPLAINT
// Asks user confirmation before removing
// =====================================================
async function handleDeleteComplaint(complaintId) {
    // Show confirmation dialog to prevent accidental deletion
    const confirmed = confirm("Are you sure you want to delete this complaint?");
    if (!confirmed) {
        return; // Cancelled by user
    }

    try {
        // Send DELETE request to DummyJSON
        await fetch("https://dummyjson.com/posts/" + complaintId, {
            method: "DELETE"
        });

        // Remove complaint from our local JavaScript array
        const updatedList = [];
        for (let i = 0; i < complaints.length; i++) {
            if (complaints[i].id !== complaintId) {
                updatedList.push(complaints[i]);
            }
        }
        complaints = updatedList;

        // Save new list to localStorage and redraw table
        saveComplaintsToLocalStorage();
        renderTable(complaints);
    } catch (error) {
        console.error("Error deleting complaint:", error);
        alert("An error occurred while deleting the complaint.");
    }
}

// =====================================================
// HTTP POST: ADD NEW COMPLAINT
// Validates user input, then calls DummyJSON /posts/add
// =====================================================
async function handleAddComplaint(title, category, description) {
    try {
        submitComplaintBtn.innerText = "Submitting...";
        submitComplaintBtn.disabled = true;

        // Send POST request to DummyJSON
        const response = await fetch("https://dummyjson.com/posts/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                body: description,
                userId: 1,
                tags: [category]
            })
        });

        const data = await response.json();

        // Create new complaint object
        // Ensure ID is unique in our local list
        let newId = data.id || Date.now();
        for (let i = 0; i < complaints.length; i++) {
            if (complaints[i].id === newId) {
                newId = Date.now(); // fallback to timestamp if ID collides
                break;
            }
        }

        const newComplaint = {
            id: newId,
            title: title,
            category: category,
            body: description,
            status: "Pending" // New complaints start as Pending
        };

        // Add to top of local array
        complaints.unshift(newComplaint);
        saveComplaintsToLocalStorage();

        // Clear input fields
        complaintTitle.value = "";
        complaintCategory.value = "";
        complaintDescription.value = "";

        // Show success notification
        addComplaintSuccess.style.display = "block";
        setTimeout(function () {
            addComplaintSuccess.style.display = "none";
        }, 3000);

        // Re-render table with newly added complaint
        renderTable(complaints);
    } catch (error) {
        console.error("Error adding complaint:", error);
        alert("Failed to submit complaint. Please check your connection.");
    } finally {
        submitComplaintBtn.innerText = "Submit Complaint";
        submitComplaintBtn.disabled = false;
    }
}

// =====================================================
// HTTP GET: SEARCH COMPLAINTS
// Calls DummyJSON search API and combines with local complaints
// =====================================================
async function handleSearch(searchTerm) {
    try {
        tableStatusMessage.innerText = "Searching complaints...";
        tableStatusMessage.style.display = "block";
        complaintsTableBody.innerHTML = "";

        // Send GET request to DummyJSON search endpoint
        const response = await fetch("https://dummyjson.com/posts/search?q=" + encodeURIComponent(searchTerm));
        const data = await response.json();

        // Build a lookup map of existing statuses from our local array
        const statusMap = {};
        for (let i = 0; i < complaints.length; i++) {
            statusMap[complaints[i].id] = complaints[i].status;
        }

        const searchResults = [];

        // Include API search matches
        for (let i = 0; i < data.posts.length; i++) {
            const post = data.posts[i];
            let cat = "other";
            if (post.tags && post.tags.length > 0) {
                cat = post.tags[0];
            }

            searchResults.push({
                id: post.id,
                title: post.title,
                category: cat,
                body: post.body,
                // Retain local status if previously modified
                status: statusMap[post.id] || "Pending"
            });
        }

        // Also check if any locally added complaint matches the search term
        const lowerSearch = searchTerm.toLowerCase();
        for (let i = 0; i < complaints.length; i++) {
            const localItem = complaints[i];
            // If it's a locally created item (ID > 251 or not already in searchResults)
            let alreadyInResults = false;
            for (let j = 0; j < searchResults.length; j++) {
                if (searchResults[j].id === localItem.id) {
                    alreadyInResults = true;
                    break;
                }
            }

            if (!alreadyInResults) {
                const matchesTitle = localItem.title.toLowerCase().indexOf(lowerSearch) !== -1;
                const matchesBody = localItem.body.toLowerCase().indexOf(lowerSearch) !== -1;
                const matchesCategory = localItem.category.toLowerCase().indexOf(lowerSearch) !== -1;

                if (matchesTitle || matchesBody || matchesCategory) {
                    searchResults.push(localItem);
                }
            }
        }

        renderTable(searchResults);
    } catch (error) {
        console.error("Search error:", error);
        tableStatusMessage.innerText = "Error searching complaints.";
        tableStatusMessage.style.display = "block";
    }
}

// =====================================================
// BUTTON EVENT LISTENER: Add Complaint Form Submission
// What button: "Submit Complaint" button
// What happens: Validates fields (title min 5 chars, desc min 10 chars, category selected),
//               then calls handleAddComplaint() which sends a POST request.
// =====================================================
addComplaintForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Clear previous validation error messages
    titleError.innerText = "";
    categoryError.innerText = "";
    descriptionError.innerText = "";

    const titleValue = complaintTitle.value.trim();
    const categoryValue = complaintCategory.value;
    const descriptionValue = complaintDescription.value.trim();

    let formValid = true;

    // Validate title (minimum 5 characters)
    if (titleValue === "") {
        titleError.innerText = "Complaint title is required";
        formValid = false;
    } else if (titleValue.length < 5) {
        titleError.innerText = "Title must be at least 5 characters";
        formValid = false;
    }

    // Validate category (must be selected)
    if (categoryValue === "") {
        categoryError.innerText = "Please select a category";
        formValid = false;
    }

    // Validate description (minimum 10 characters)
    if (descriptionValue === "") {
        descriptionError.innerText = "Complaint description is required";
        formValid = false;
    } else if (descriptionValue.length < 10) {
        descriptionError.innerText = "Description must be at least 10 characters";
        formValid = false;
    }

    // If all validation rules pass, call POST API
    if (formValid) {
        handleAddComplaint(titleValue, categoryValue, descriptionValue);
    }
});

// =====================================================
// BUTTON EVENT LISTENER: Search Button
// What button: "Search" button
// What happens: Reads the search text box and calls handleSearch() using GET request
// =====================================================
searchBtn.addEventListener("click", function () {
    const query = searchInput.value.trim();
    if (query === "") {
        // If query is empty, show all complaints
        renderTable(complaints);
    } else {
        handleSearch(query);
    }
});

// =====================================================
// BUTTON EVENT LISTENER: Clear Search Button
// What button: "Clear" button
// What happens: Empties search box and redraws full complaints list from local array
// =====================================================
clearSearchBtn.addEventListener("click", function () {
    searchInput.value = "";
    renderTable(complaints);
});

// =====================================================
// BUTTON EVENT LISTENER: Reset Data Button
// What button: "Reset Data (From API)" button
// What happens: Clears complaints stored in localStorage and fetches fresh data from API
// =====================================================
resetDataBtn.addEventListener("click", function () {
    const askReset = confirm("Reset all data and reload original 15 complaints from API?");
    if (askReset) {
        localStorage.removeItem("complaints");
        loadComplaintsFromAPI();
    }
});

// =====================================================
// BUTTON EVENT LISTENER: Logout Button
// What button: "Logout" button in navigation bar
// What happens: Removes login token and username from localStorage, redirects to index.html
// =====================================================
navLogoutBtn.addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userRole");
    window.location.href = "index.html";
});

// =====================================================
// BUTTON EVENT LISTENER: Switch Role Button
// What button: "Switch Role" button in header
// What happens: Toggles role between Student and Mess Warden,
//               updates localStorage, and updates UI without re-logging in
// =====================================================
switchRoleBtn.addEventListener("click", function () {
    if (currentRole === "Student") {
        currentRole = "Warden";
    } else {
        currentRole = "Student";
    }
    localStorage.setItem("userRole", currentRole);
    updateRoleUI();
    renderTable(complaints);
});

// =====================================================
// INITIALIZATION ON PAGE LOAD
// 1. Update the role UI elements (badge, button, heading)
// 2. Load complaints from localStorage or fallback to API
// =====================================================
updateRoleUI();

const savedComplaintsString = localStorage.getItem("complaints");
if (savedComplaintsString) {
    try {
        complaints = JSON.parse(savedComplaintsString);
        renderTable(complaints);
    } catch (e) {
        // If JSON parsing fails, reload fresh from API
        loadComplaintsFromAPI();
    }
} else {
    loadComplaintsFromAPI();
}

