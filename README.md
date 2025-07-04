# 💸 Personal Expense Tracker - Frontend

This is the **frontend** of the **Personal Expense Tracker** web application built with **React**, using **Redux Toolkit** for state management, **React Router** for navigation, and **Axios** for API integration.

The app allows users to register, log in, manage their expenses (create, update, delete, view), and access basic analytics like monthly totals and category-wise breakdowns.

---

## 🔗 Live Demo

👉 [https://personalexpensetracker-vm.vercel.app/](https://personalexpensetracker-vm.vercel.app/)

## 📚 Features

### ✅ Authentication

- User Registration and Login using JWT tokens
- Protected routes for logged-in users
- Secure token storage in memory or localStorage

### ✅ Expense Management

- Add, edit, delete expenses
- Fields: amount, category, date, description
- Paginated and searchable expense listing
- Filter by category and search by text
- View specific expense details

### ✅ Dashboard & Analytics

- Monthly total expense tracker
- Category-wise expense summary (with optional charts)

---

## 🛠️ Tech Stack

| Category   | Technology                         |
| ---------- | ---------------------------------- |
| Frontend   | React, React Router, Redux Toolkit |
| API Client | Axios                              |
| State Mgmt | Redux Toolkit                      |
| Charts     | (Optional) Chart.js / Recharts     |
| Styling    | HTML5, CSS3 (No frameworks used)   |
| Build Tool | Vite                               |

---

## 🧾 Folder Structure

src/
│
├── components/ # Reusable UI components
├── pages/ # Login, Register, Dashboard, etc.
├── store/ # Redux store & slices
├── services/ # API service (Axios config)
├── styles/ # CSS files
├── App.tsx # App entry with routing
└── main.tsx # ReactDOM render

## 👨‍💻 Author

**Vishal Mahto**
