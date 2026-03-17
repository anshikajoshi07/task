# Web Development Internship Task

Simple frontend project for the internship assignment.

## Features
- Internship form with fields:
  - Full Name
  - Email
  - Phone Number
  - Portfolio / GitHub URL (optional)
  - Task Details
- Validation:
  - All required fields are validated
  - Email format
  - 10-digit phone number
- Submissions stored in `localStorage`
- Display list of submitted entries
- Delete saved entries

## Files
- `index.html` (main page; loads CSS + JS)
- `style.css` (styles)
- `script.js` (form submission behavior)
- `README.md`

## Run
1. Open `task/index.html` in browser.
2. Fill the form and click **Submit**.
3. See submission list below the form.

## Optional improvements (agar time ho)
- Add edit entry capability
- Export all entries to JSON/download file
- Dark mode toggle
- Server API for persistence (Node.js/Python backend)