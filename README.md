<div align="center">

# 🛍️ E-Commerce Backend Design — Full-Stack Store

### Built during my Full Stack Developer Internship at [DevelopersHub Corporation](https://www.linkedin.com/company/developershub-corporation/)

[![Live Demo](https://img.shields.io/badge/Live_Demo-ecommerce--backend--by--sheraz.vercel.app-4F46E5?style=for-the-badge)](https://ecommerce-backend-by-sheraz.vercel.app/)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-00D084?style=for-the-badge)](#-tech-stack)
[![Internship](https://img.shields.io/badge/Internship-DevelopersHub_Corp-FF6B35?style=for-the-badge)](#-internship-context)

A production-style full-stack e-commerce application demonstrating robust **backend architecture** with Node.js/Express.js, MongoDB, JWT authentication, role-based access control, and a React/Vite frontend.

[Live Demo](https://ecommerce-backend-by-sheraz.vercel.app/) · [Features](#-features) · [Tech Stack](#-tech-stack) · [API Docs](#-api-documentation) · [Getting Started](#-getting-started)

</div>

---

## 🏢 Internship Context

This project was designed and developed during my **Full Stack Developer internship** at **[DevelopersHub Corporation](https://www.linkedin.com/company/developershub-corporation/)** (May 2026 – June 2026). It served as the primary backend-focused internship deliverable demonstrating production-style API design and full-stack integration.

**Internship objectives covered:**
- Design and implement RESTful APIs using Express.js v5 and MongoDB
- Build secure authentication and authorization with JWT and role-based access (`user` / `admin`)
- Integrate third-party services for media handling (Cloudinary)
- Connect a React frontend to production-style backend endpoints
- Implement data seeding utilities for realistic testing
- Organize the codebase with MVC architecture, middleware, and modular routing
- Deploy full-stack application (Vercel + Render + MongoDB Atlas)

---

## ✨ Features

### 👤 User Features
| Feature | Description |
|---------|-------------|
| **User Registration & Login** | Secure JWT-based authentication |
| **Product Browsing** | Browse products with filtering and search |
| **Product Details** | View detailed product information with images |
| **Responsive UI** | Mobile-friendly React frontend |

### 🔐 Admin Features
| Feature | Description |
|---------|-------------|
| **Product Management** | Full CRUD — create, read, update, delete products |
| **Image Upload** | Cloudinary integration for product image hosting |
| **Role-Based Access** | Admin-only routes protected by middleware |
| **Data Seeding** | Seed script for populating realistic test data |

### 🏗️ Architecture Highlights
| Feature | Description |
|---------|-------------|
| **MVC Pattern** | Clean separation of routes, controllers, models, middleware |
| **Protected Routes** | JWT verification middleware on all sensitive endpoints |
| **Role Authorization** | `user` and `admin` roles with different permissions |
| **Error Handling** | Centralized error handling middleware |
| **CORS Configuration** | Production-ready cross-origin setup |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Server-side JavaScript runtime |
| **Express.js v5** | Web framework (latest version) |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **bcrypt** | Password hashing |
| **Cloudinary** | Image upload and CDN |
| **Multer** | File upload handling |
| **CORS** | Cross-origin resource sharing |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **React Router DOM** | Client-side routing |
| **Axios** | HTTP client |
| **Tailwind CSS** | Utility-first styling |

### Deployment
| Service | Purpose |
|---|---|
| **Vercel** | Frontend hosting |
| **Render** | Backend API hosting |
| **MongoDB Atlas** | Cloud database |
| **Cloudinary** | Image CDN |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│            FRONTEND (Vercel)                       │
│        React 18 + Vite + Tailwind CSS             │
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Product  │  │  Auth    │  │ Admin Panel  │  │
│  │ Listing  │  │  Pages   │  │ (CRUD)       │  │
│  └────┬─────┘  └────┬─────┘  └──────┬────────┘  │
│       │              │               │           │
├───────┼──────────────┼───────────────┼───────────┤
│                   REST API                        │
├─────────────────────────────────────────────────────┤
│            BACKEND (Render)                       │
│        Express.js v5 + MongoDB                    │
│                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │   Auth       │  │  Product     │  │  Middleware │  │
│  │  Controller  │  │ Controller   │  │  (JWT +     │  │
│  │  (JWT+Roles) │  │ (CRUD+Search)│  │   Roles)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬─────┘  │
│        └─────────────┼──────────────┘           │
│             ┌───────┴───────┐                    │
│             │ MongoDB Atlas │                    │
│             └───────────────┘                    │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │    Cloudinary (Product Image CDN)             │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
ecommerce-backend-design/
├── backend/
│   ├── src/
│   │   ├── app.js                # Express app configuration
│   │   ├── server.js             # Server entry point
│   │   ├── config/
│   │   │   ├── cloudinary.js     # Cloudinary configuration
│   │   │   └── db.js             # MongoDB connection setup
│   │   ├── controllers/
│   │   │   ├── authController.js # Registration, login, JWT
│   │   │   └── productController.js # Product CRUD + search
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT verification middleware
│   │   │   └── upload.js         # Multer + Cloudinary upload
│   │   ├── models/
│   │   │   ├── Product.js        # Product schema
│   │   │   └── User.js           # User schema (with roles)
│   │   ├── routes/
│   │   │   ├── authRoutes.js     # Auth endpoints
│   │   │   ├── productRoutes.js  # Product endpoints
│   │   │   └── index.js          # Route aggregator
│   │   └── scripts/
│   │       └── seed.js           # Database seeding utility
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   ├── pages/                # Route page components
│   │   ├── services/             # API service layer
│   │   ├── context/              # Auth context provider
│   │   ├── App.jsx               # Root component
│   │   └── main.jsx              # Entry point
│   └── package.json
│
└── README.md
```

---

## 📡 API Documentation

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |

### Products
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | List all products (with filtering & search) |
| `GET` | `/api/products/:id` | Public | Get product details by ID |
| `POST` | `/api/products` | Admin only | Create a new product (with image upload) |
| `PUT` | `/api/products/:id` | Admin only | Update a product |
| `DELETE` | `/api/products/:id` | Admin only | Delete a product |

### Role-Based Access Control

```
┌───────────────────────────────────────────────┐
│  PUBLIC ROUTES (No Auth Required)             │
│  • POST /api/auth/register                    │
│  • POST /api/auth/login                       │
│  • GET  /api/products                         │
│  • GET  /api/products/:id                     │
├───────────────────────────────────────────────┤
│  ADMIN ROUTES (JWT + admin role)              │
│  • POST   /api/products      (create)         │
│  • PUT    /api/products/:id  (update)         │
│  • DELETE /api/products/:id  (delete)         │
└───────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** database (or [MongoDB Atlas](https://www.mongodb.com/atlas) account)
- **Cloudinary** account for image uploads

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
PORT=3000
```

Seed the database (optional):
```bash
node src/scripts/seed.js
```

Start the server:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file:
```env
VITE_BACKEND_URL=http://localhost:3000
```

Start the app:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔑 Key Technical Highlights

| Aspect | Implementation |
|--------|---------------|
| **Authentication** | JWT with bcrypt password hashing |
| **Authorization** | Role-based middleware (`user` vs `admin`) |
| **Image Handling** | Multer → Cloudinary pipeline for product images |
| **Data Seeding** | Custom seed script for realistic demo data |
| **API Design** | RESTful conventions with proper HTTP status codes |
| **Error Handling** | Centralized error middleware with meaningful messages |
| **CORS** | Configured for production frontend-backend separation |

---

## 👨‍💻 Developer

**Muhammad Sheraz**
Full Stack Developer (MERN Stack)

🌐 [Portfolio](https://sherazportfolio.vercel.app) · 💼 [LinkedIn](https://linkedin.com/in/muhammad-sheraz-800948347) · 🏢 Internship at [DevelopersHub Corporation](https://www.linkedin.com/company/developershub-corporation/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
