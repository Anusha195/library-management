# 📚 Library Management System

A full-stack web application built using **Node.js**, **Firebase Firestore**, and **Bootstrap** to manage books, borrowing, and user interactions in a library environment. It supports different user roles—**Students**, **Teachers**, and **Employees (Admins)**—with role-specific functionalities.

---

## 🚀 Features

### 🔐 Authentication
- Firebase Authentication with Email & Password
- Role-based login: Student / Teacher / Employee
- Secure sessions with logout functionality

### 👨‍🎓 Student & Teacher Panel
- Check real-time availability
- Request to borrow books
- Report issues related to issued books

### 🧑‍💼 Employee (Admin) Panel
- View and manage book requests
- Approve borrowing requests
- Issue or return books
- View and resolve reported issues

---

## 🛠️ Tech Stack

| Layer        | Technology              |
|--------------|--------------------------|
| Frontend     | HTML, CSS, Bootstrap, EJS |
| Backend      | Node.js, Express.js       |
| Database     | Firebase Firestore        |
| Auth System  | Firebase Authentication   |
| Templating   | EJS                        |

---

## 🔧 Project Structure

library-management-system/
├── public/ # CSS, JS, images
├── routes/ # Express route files
├── views/ # EJS template files
├── key.json # Firebase SDK & initialization
├── app.js # Main server file
├── package.json # Node dependencies
└── README.md # Project documentation

git clone https://github.com/Anusha195/library-management
cd library-management-system
npm install

Start the server
node app.js
