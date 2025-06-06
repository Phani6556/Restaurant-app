# Restaurant Management System - Frontend

A React-based restaurant management system that allows staff to manage orders, tables, and assignments in real-time.

## 🧾 Project Pages Overview

### 📦 1. Orders Page (`Orders.jsx`)

#### Features:
- Real-time order updates using **Socket.IO**
- Filters for **Order Type** and **Status**
- View order items, timestamps, and cooking duration
- **Assign Tables** to "Dine In" orders
- **Assign Chefs** to orders dynamically based on least workload
- Toggle **Picked Up/Not Picked Up** for Take Away orders
- Reflects **table status** and **chef assignments** immediately

#### APIs Used:
- `GET /api/orders`: Fetch all orders
- `PUT /api/orders/:orderId`: Update order status
- `PUT /api/orders/:orderId/assign-table`: Assign a table
- `PUT /api/orders/:orderId/assign-chef`: Assign a chef
- `GET /api/tables`: Fetch current table list
- `GET /api/dashboard/chef-summary`: Fetch current chef load summary

---

### 🍽️ 2. Tables Page (`Tables.jsx`)

#### Features:
- Add, delete, search, and filter tables
- Toggle **table status** between "Available" and "Reserved"
- Real-time **table status update sync** using Socket.IO
- Displays number of chairs per table
- Toast notifications for success/error actions

#### APIs Used:
- `GET /api/tables`: Fetch all tables
- `POST /api/tables`: Create a new table
- `DELETE /api/tables/:tableId`: Delete a table
- `PATCH /api/tables/:tableId/status`: Update table status

---

## 📡 Socket.IO Integration

- `orderUpdate`: Listens for real-time updates to incoming or modified orders
- `tableStatusUpdated`: Listens for real-time changes to table availability/reservations

---

## ✅ Technologies Used

### Frontend
- React (Functional Components + Hooks)
- Axios for HTTP requests
- Socket.IO for real-time communication
- React Toastify for notifications
- CSS modules for component-level styling
- FontAwesome / React Icons for UI enhancement

### Backend:
- Node.js + Express
- MongoDB (Mongoose)
- Socket.io (real-time table and order updates)

---

## 📂 File Structure Overview

```bash
/src
│
├── components/
│   ├── Orders.jsx       # Handles orders logic and UI
│   └── Tables.jsx       # Handles table CRUD and UI
│
├── styles/
│   ├── Orders.css
│   └── Tables.css
│
├── context/
│   └── CartContext.js   # (If using global cart or state)
│
└── App.js               # Main entry point with routing

# Install dependencies
npm install

# Start development server
npm start

Restaurant Demo link - https://restaurant-app-coral-mu.vercel.app/
