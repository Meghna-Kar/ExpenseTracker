
# Expense Tracker

A full-stack expense tracking system built with **React (Vite)** on the frontend and **Node.js + MySQL** on the backend.

---

## Prerequisites

Make sure the following are installed:

- Node.js (v18+)
- MySQL Server
- npm (comes with Node.js)

---

## Project Setup

### Backend Setup (server/)

1. Open terminal and navigate to the server directory:
   - cd server
   

2. Install dependencies:
   -  npm install


3. Start the server:
   
   - npm run dev
   

---

###  Frontend Setup (client/)

1. Open terminal in the client directory:
   
   - cd client
   

2. Install frontend dependencies:
   
   - npm install
   

3. Start the development server:
   
   - npm run dev
   

4. Open browser at:  
    `http://localhost:8080`

---

## 🗄️ Import MySQL Database

1. Open MySQL Command Line Client or any SQL GUI.

2. Run this command to import the provided schema:
   
   SOURCE C:/Users/Dell/Desktop/schema.sql;
   
   (Update the path if you saved `schema.sql` elsewhere)

---

## Screenshots

Please refer to the `screenshots/` folder in this project for:

- Dashboard
- Expenses
- Top 3 spending days per user
- Monthly percentage change in expenditure
- Predicted next month’s spending
- Responsive UI

Each is generated and captured from the running frontend.

---

## Validations

- **Client-side:** All required fields are validated (amount, category, date).
- **Server-side:**  valid formats, and constraint checks before DB insert.

---

## Folder Structure

```
ExpenseTracker/
├── client/           # Frontend (React + Vite)
├── server/           # Backend (Node.js + Express)
├── schema.sql        # MySQL DB structure + data
├── README.md         # This file
├── screenshots/      # Screenshots 
```

---

## Notes

- All APIs are tested and functioning via POSTMAN.
- This is a personal expense manager supporting CRUD + analytics.
