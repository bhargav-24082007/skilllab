# Hostel Mess Complaint Portal

A simple, lightweight, and educational web application built with **pure HTML, CSS, and Vanilla JavaScript**. Designed for college students to demonstrate web fundamentals and easily explain every line of code during a viva or practical exam.

---

## Quick Start (No Server or Installation Needed!)

1. Simply **double-click** `index.html` in your file explorer to open it in your web browser.
2. Log in using the demo credentials:
   - **Username**: `emilys`
   - **Password**: `emilyspass`
   - **Role**: Choose **Hostel Student** or **Mess Warden**
3. You will be redirected to `dashboard.html` where you can view, add, search, resolve, and delete complaints!
   - You can also switch roles on the fly using the **"⇄ Switch to Warden / Student"** button on the dashboard for quick viva demonstration!

---

## Project Structure

```
project1/
├── index.html        # Login page HTML (Form, validation, error display)
├── login.js          # Login logic (Validates, calls POST auth/login, saves to localStorage)
├── dashboard.html    # Complaints dashboard (Greeting, Add form, Search bar, Table)
├── dashboard.js      # Dashboard logic (GET, POST, PUT, DELETE, localStorage sync, dynamic DOM)
├── contact.html      # Contact committee page (Form, validation, success display)
├── contact.js        # Contact logic (Validates, calls fake POST, provides feedback)
├── style.css         # Clean, simple CSS styles for all pages
├── theory.md         # Full viva preparation guide with technical concepts & top 20 Q&A
└── README.md         # Project overview and quick start guide
```

---

## Features Implemented

- **Form Validation**: Clean error messages displayed directly under form fields (no annoying `alert()` boxes).
- **HTTP Methods Demonstrated**:
  - `GET`: Fetch complaints list and search complaints by keyword.
  - `POST`: User login, submitting a new complaint, and sending a contact message.
  - `PUT`: Resolving an existing complaint.
  - `DELETE`: Deleting a complaint with a confirmation prompt.
- **Local Persistence**: Uses `localStorage` to preserve login tokens and complaints across page refreshes.
- **Mock API Synchronization**: Handles DummyJSON's mock behavior gracefully by synchronizing changes with local storage.
- **Clean Event Architecture**: 100% `addEventListener` based event handling with detailed comments above each listener.
- **Reset Feature**: "Reset Data" button allows refreshing data from the server at any time.

---

## For Viva & Exam Preparation

Be sure to read [`theory.md`](theory.md) thoroughly. It explains:
- How `fetch()` with `async`/`await` works
- The 4 HTTP methods in detail
- What `localStorage` and JSON methods do
- Why DummyJSON only simulates changes
- 20 common viva questions with concise model answers
