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
##Folder Structure

library-management-system/
-public/            # Static assets (CSS, JS, images),
-views/             # EJS template files.
-key.json           # Firebase configuration.
-app.js             #  Express route handlers.
-package.json       # Project dependencies README.md          


git clone https://github.com/Anusha195/library-management
cd library-management-system
npm install

Start the server
node app.js
