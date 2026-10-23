# Hostel Mess Complaint Portal - Complete Viva & Theory Guide

This document is written in simple, clear language so any student can understand and confidently explain every single part of this project during an external viva or lab examination.

---

## 1. Project Overview

### What is this project?
The **Hostel Mess Complaint Portal** is a web application where hostel students can:
1. **Log in** securely using student credentials.
2. **View complaints** about mess food, cleanliness, timings, and other issues in a tabular format.
3. **Add new complaints** with client-side form validation.
4. **Search complaints** by keyword using an API.
5. **Mark complaints as Resolved** (using HTTP PUT).
6. **Delete complaints** after user confirmation (using HTTP DELETE).
7. **Contact the mess warden/committee** via a validated contact form.
8. **Persist data** across browser refreshes using `localStorage`.

---

## 2. File Structure & Responsibilities

| File Name | Purpose | What to say in Viva |
| :--- | :--- | :--- |
| `index.html` | Login Page HTML | Contains the username and password form, demo credentials box, and error message containers. |
| `login.js` | Login Logic | Validates input, sends a `POST` request to `https://dummyjson.com/auth/login`, and stores `token` and `username` in `localStorage`. |
| `dashboard.html` | Complaints Dashboard HTML | Contains navigation bar, greeting header, "Add Complaint" form, search bar, and the complaints data table. |
| `dashboard.js` | Dashboard Core Logic | Manages the complaints array, handles all 4 HTTP methods (`GET`, `POST`, `PUT`, `DELETE`), updates `localStorage`, and dynamically renders table rows. |
| `contact.html` | Contact Page HTML | Contains a clean form for students to submit direct inquiries to the warden. |
| `contact.js` | Contact Logic | Validates name, email, and message, then sends a `POST` request to the API. |
| `style.css` | Global Stylesheet | Contains basic, responsive styling: table borders, button colors (green for resolve, red for delete), badges, and red error messages. |
| `theory.md` | Viva Preparation Document | Detailed technical concepts and viva Q&A. |

---

## 3. Technology Stack & Key Rules

- **Vanilla HTML5, CSS3, and JavaScript**: No external libraries (No React, No Angular, No Vue, No jQuery, No Bootstrap, No npm).
- **Zero Build Tools**: Runs directly in any web browser by double-clicking `index.html` (file protocol friendly).
- **Modern Asynchronous JS**: Uses standard `fetch()` with `async` and `await`. No outdated `XMLHttpRequest` or third-party `axios`.
- **Clean Event Listeners**: All buttons and forms use `.addEventListener()` instead of inline `onclick` attributes.

---

## 4. The DummyJSON API & The Mock API Concept

### What is DummyJSON?
`https://dummyjson.com` is a free, public REST API that provides dummy data for learning and testing. It requires no API keys.

### The 4 HTTP Methods Used in this Project:

1. **`GET` (Read data)**:
   - Initial Load: `GET https://dummyjson.com/posts?limit=15` (fetches 15 complaints).
   - Search: `GET https://dummyjson.com/posts/search?q=query` (fetches matching complaints).

2. **`POST` (Create data)**:
   - Login: `POST https://dummyjson.com/auth/login` (verifies username & password, returns auth token).
   - Add Complaint: `POST https://dummyjson.com/posts/add` (registers a new complaint).
   - Contact Message: `POST https://dummyjson.com/posts/add` (simulates sending a message).

3. **`PUT` (Update data)**:
   - Resolve Complaint: `PUT https://dummyjson.com/posts/{id}` (updates status to "Resolved").

4. **`DELETE` (Remove data)**:
   - Delete Complaint: `DELETE https://dummyjson.com/posts/{id}` (removes the complaint).

---

## 5. VERY IMPORTANT: Why LocalStorage is Needed

### The "Pretend" Problem with Mock APIs:
> **Question the Examiner Will Ask:** *"If you add a new complaint with POST or delete a complaint with DELETE, why doesn't DummyJSON keep it saved on their server?"*

**Your Answer:**
> *"DummyJSON is a **mock / fake REST API**. For safety and shared public use, it only **simulates** create, update, and delete operations. It sends back a successful response code (`200 OK` or `201 Created`) with the simulated object, but it **does not alter its actual database** on the server."*

### How Our Code Solves This:
After every successful HTTP request:
1. We update our local JavaScript array (`complaints`).
2. We save the updated array into the browser's `localStorage` using `localStorage.setItem("complaints", JSON.stringify(complaints))`.
3. We re-render the HTML table from this array.
4. On subsequent page loads or refreshes, our script first checks `localStorage`. If data is found, it uses the stored data.
5. We also provide a **"Reset Data"** button that clears `localStorage` and loads fresh data from the server.

---

## 6. Detailed Technical Explanations

### A. What is `fetch()` with `async` and `await`?
- **`fetch(url, options)`**: A built-in JavaScript browser function to make asynchronous HTTP network requests. It returns a `Promise`.
- **`async` keyword**: Placed before a function declaration (`async function ...`) to signify that the function handles asynchronous tasks and returns a Promise.
- **`await` keyword**: Pauses execution inside an `async` function until the `Promise` settles (resolves or rejects), without blocking the browser UI thread.
- **Why this is better than callbacks or `.then()` chains**: It makes asynchronous code look and read like clean, synchronous code, making it easier to read and debug.

### B. Why use `JSON.stringify()` and `JSON.parse()`?
- `localStorage` can **only store text strings**. It cannot store JavaScript objects or arrays directly.
- **`JSON.stringify(object)`**: Converts a JavaScript object/array into a string representation so it can be saved in `localStorage` or sent over HTTP.
- **`JSON.parse(string)`**: Converts a stored JSON string back into a usable JavaScript object or array.

### C. Why `event.preventDefault()`?
- By default, when an HTML `<form>` is submitted, the browser attempts to submit the form data to the URL and **reloads the entire page**.
- `event.preventDefault()` stops that default page reload behavior so our JavaScript can validate inputs and make asynchronous `fetch()` API calls smoothly in the background.

### D. Why `addEventListener()` instead of inline `onclick=""`?
1. **Separation of Concerns**: HTML handles content structure; CSS handles styling; JavaScript handles behavior. Mixing JavaScript into HTML tags (`onclick="..."`) creates messy code.
2. **Multiple Listeners**: `addEventListener` allows attaching multiple handlers to the same event without overwriting existing ones.
3. **Dynamic Elements**: When rows are dynamically generated in JavaScript using `document.createElement()`, we can directly attach listeners to each button before appending it to the DOM.

### E. Client-Side Validation:
- Validating user inputs before sending network requests:
  - Saves network bandwidth and server processing.
  - Gives the user immediate feedback under the exact input field.
  - Prevents malformed or empty payloads from reaching APIs.

---

## 7. Top 20 Viva Questions and Answers

### Q1: What is Vanilla JavaScript?
**Answer:** Vanilla JavaScript refers to standard, pure JavaScript without using any external libraries, frameworks, or plugins (like React or jQuery).

### Q2: What is the purpose of `localStorage`?
**Answer:** `localStorage` is a browser Web Storage API that allows websites to store key-value data persistently on the client machine. The data survives page reloads and browser restarts.

### Q3: What is the difference between `localStorage` and `sessionStorage`?
**Answer:** `localStorage` data persists indefinitely until manually cleared by code or user. `sessionStorage` data is cleared automatically as soon as the browser tab or window is closed.

### Q4: How is authentication handled in this portal?
**Answer:** When the student submits the login form with valid credentials, a `POST` request is sent to `https://dummyjson.com/auth/login`. On success, the API returns an `accessToken` and user information, which we store in `localStorage`. Pages check for this token and redirect to `index.html` if it is absent.

### Q5: What does `PUT` do compared to `POST`?
**Answer:** `POST` is typically used to create a new resource on the server. `PUT` is used to update an existing resource or replace its data.

### Q6: What does `DELETE` do?
**Answer:** The `DELETE` HTTP method instructs the server to remove the specified resource identified by its URL (e.g., `/posts/1`).

### Q7: What is the DOM?
**Answer:** The Document Object Model (DOM) is a programming interface representing the HTML document as a tree of objects. JavaScript uses DOM methods (like `getElementById` and `createElement`) to read and modify HTML elements dynamically.

### Q8: What does `response.json()` do in a fetch call?
**Answer:** It reads the HTTP response stream to completion and parses the response body text as JSON, returning a Promise that resolves to a JavaScript object.

### Q9: Why is `response.ok` checked?
**Answer:** `fetch()` does not automatically reject HTTP error status codes like 400 or 500. `response.ok` is a boolean property that is `true` only if the HTTP status code is in the 200–299 range.

### Q10: How do you prevent SQL injection or XSS in plain JavaScript?
**Answer:** Using `.innerText` or `.textContent` instead of `.innerHTML` when displaying user input ensures that malicious HTML/script tags are treated purely as plain text and not executed by the browser.

### Q11: What is a Promise in JavaScript?
**Answer:** A Promise is an object representing the eventual completion (fulfillment) or failure of an asynchronous operation, and its resulting value.

### Q12: Why did we use `try...catch` blocks?
**Answer:** `try...catch` is used for error handling. If a network failure occurs during `fetch()` or parsing, the error is caught in the `catch` block without crashing the script, allowing us to display friendly error messages to the user.

### Q13: How does the search function work?
**Answer:** The user enters a search term and clicks "Search". The script calls `GET https://dummyjson.com/posts/search?q={term}` and combines those results with locally added complaints matching the query, then re-renders the table.

### Q14: What happens when the user clicks "Resolve"?
**Answer:** A `PUT` request is sent to `/posts/{id}`. We then update the status property of that complaint object to `"Resolved"` in our local array, save it into `localStorage`, and redraw the table so the button changes to "Resolved ✓" (disabled) and badge turns green.

### Q15: Why did you use `confirm()` before deleting?
**Answer:** The `confirm()` dialog box provides a native browser pop-up asking the user to confirm their action, preventing accidental and irreversible data loss.

### Q16: What is the purpose of the "Reset Data" button?
**Answer:** Because our edits are saved in `localStorage`, clicking "Reset Data" deletes the stored `complaints` key from `localStorage` and fetches fresh, initial complaint records from DummyJSON.

### Q17: Can this application work offline?
**Answer:** The HTML, CSS, and already cached data in `localStorage` load without an internet connection. However, initial login, first load of complaints, search API, and sending messages require an active internet connection to contact `dummyjson.com`.

### Q18: What is CORS?
**Answer:** Cross-Origin Resource Sharing (CORS) is a browser security mechanism that allows or restricts resources requested from another domain. DummyJSON has CORS headers enabled (`Access-Control-Allow-Origin: *`), which is why our local HTML file can call its endpoints directly.

### Q19: What is `Date.now()` used for when adding complaints?
**Answer:** When creating a complaint locally, DummyJSON returns a fixed simulated ID (e.g., 252). If multiple complaints are added, using `Date.now()` guarantees a unique numerical timestamp ID for each complaint in our local array.

### Q20: How does the Logout button work?
**Answer:** It calls `localStorage.removeItem("token")`, `localStorage.removeItem("username")`, and `localStorage.removeItem("userRole")` to wipe the saved session credentials and then sets `window.location.href = "index.html"` to redirect the student to the login page.

### Q21: Why are there Student and Warden roles in this portal?
**Answer:** In a real-world mess system, students raise complaints while the mess warden is responsible for addressing and resolving them. Our portal supports both perspectives: Students can lodge complaints and mark their own issues closed, while the Warden has official authority to resolve complaints (`HTTP PUT`) and review all issues. A quick switch button allows instant role toggling during viva demonstrations.

### Q22: How is the role switch implemented without a backend server or database?
**Answer:** When the user selects a role during login or clicks the "Switch Role" button, JavaScript saves the role string (`"Student"` or `"Warden"`) in browser `localStorage.setItem("userRole", role)`. The frontend then reads `localStorage.getItem("userRole")` to dynamically update the greeting badge, button labels, and authority descriptions.

---

## 8. Role-Based Feature: Student vs. Mess Warden

| Feature | Student Role | Mess Warden Role |
| :--- | :--- | :--- |
| **Primary Goal** | Raise complaints & track resolution | Investigate & resolve student issues |
| **Add Complaint** | Labeled *"Add New Complaint"* | Labeled *"Add Official Mess Complaint / Notice"* |
| **Resolve Button** | Labeled *"Mark Resolved"* (user ticket closure) | Labeled *"Resolve (Warden)"* (official authority) |
| **Badge Color** | Purple / Indigo Badge (`Role: Student`) | Warm Amber Badge (`Role: Mess Warden`) |
| **Role Toggle** | Instant toggle via *"⇄ Switch to Warden"* button | Instant toggle via *"⇄ Switch to Student"* button |

