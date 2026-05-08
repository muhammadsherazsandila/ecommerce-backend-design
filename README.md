# 🛒 E-Commerce Backend Design

A full-stack e-commerce application with a **Node.js/Express** REST API backend and a **React/Vite** frontend. Built to demonstrate clean backend architecture — JWT authentication, role-based access control, Cloudinary image uploads, and MongoDB data modeling.

> **Author:** [Muhammad Sheraz](https://muhammadsheraz.dev/)

> 🌐 **Live Demo:** [ecommerce-backend-by-sheraz.vercel.app](https://ecommerce-backend-by-sheraz.vercel.app)

---

## ✨ Features

### Authentication & Authorization
- User **signup** and **login** with hashed passwords (bcrypt)
- **JWT**-based session tokens (7-day expiry)
- **Role-based access** — `user` and `admin` roles
- Protected `/me` endpoint to fetch the current user

### Product Management
- **Create products** (admin only) with image upload via Cloudinary
- **Browse products** with pagination, search, and filters (category, brand, price range, featured)
- **Homepage data** endpoint — categories, featured items, and recommendations in a single request
- **Search** with auto-suggestions
- **Featured products** and **categories** endpoints

### Infrastructure
- Express 5 with `compression` middleware
- CORS configured for frontend origin
- Multer for in-memory file handling (5 MB limit)
- Cloudinary auto-optimization (resize, quality, format)
- MongoDB text indexes for search performance
- Nodemon for development hot-reload

---

## 🏗️ Project Structure

```
ecommerce-backend-design/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.js      # Cloudinary SDK setup
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js   # Signup, login, getMe
│   │   │   └── productController.js # Product CRUD (create + read)
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT protect & adminOnly guards
│   │   │   └── upload.js          # Multer + Cloudinary upload helper
│   │   ├── models/
│   │   │   ├── Product.js         # Product schema & text indexes
│   │   │   └── User.js            # User schema with password hashing
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # /api/auth/*
│   │   │   ├── productRoutes.js   # /api/products/*
│   │   │   └── index.js           # Route aggregator
│   │   ├── scripts/
│   │   │   └── seed.js            # Database seeder
│   │   ├── app.js                 # Express app setup
│   │   └── server.js              # Entry point — DB connect & listen
│   ├── .env                       # Environment variables (not committed)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/            # React components (AddProduct, Cart, etc.)
│   │   ├── api.js                 # Axios API client
│   │   └── ...
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** running locally (or a connection URI)
- **Cloudinary** account — [console.cloudinary.com](https://console.cloudinary.com/)

### 1. Clone the repo

```bash
git clone https://github.com/muhammadsherazsandila/ecommerce-backend-design.git
cd ecommerce-backend-design
```

### 2. Setup the backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=3000
HOST=localhost
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Seed the database (optional)

```bash
npm run seed
```

### 4. Start the backend

```bash
npm run dev        # development (nodemon)
npm start          # production
```

The API will be available at `http://localhost:3000`.

### 5. Setup the frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## 📡 API Reference

**Base URL:** `http://localhost:3000/api`

### Auth

| Method | Endpoint        | Auth     | Description                  |
|--------|-----------------|----------|------------------------------|
| POST   | `/auth/signup`  | —        | Register a new user          |
| POST   | `/auth/login`   | —        | Login and receive JWT        |
| GET    | `/auth/me`      | Bearer   | Get current user profile     |

#### Signup

```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

#### Login

```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### Products — Public

| Method | Endpoint               | Description                                  |
|--------|------------------------|----------------------------------------------|
| GET    | `/products`            | List products (paginated, filterable)        |
| GET    | `/products/search`     | Search with suggestions                      |
| GET    | `/products/homepage`   | Homepage bundle (categories, featured, etc.) |
| GET    | `/products/featured`   | Featured products                            |
| GET    | `/products/categories` | All unique categories                        |
| GET    | `/products/:id`        | Single product by ID                         |

#### Query Parameters for `GET /products`

| Param      | Type    | Default       | Description                      |
|------------|---------|---------------|----------------------------------|
| `page`     | number  | `1`           | Page number                      |
| `limit`    | number  | `12`          | Items per page (max 50)          |
| `search`   | string  | —             | Full-text search                 |
| `category` | string  | —             | Filter by exact category         |
| `brand`    | string  | —             | Filter by brand                  |
| `minPrice` | number  | —             | Minimum price                    |
| `maxPrice` | number  | —             | Maximum price                    |
| `featured` | boolean | —             | Only featured products           |
| `sort`     | string  | `-createdAt`  | Sort field (prefix `-` for desc) |

---

### Products — Admin

| Method | Endpoint     | Auth          | Description                        |
|--------|-------------|---------------|------------------------------------|
| POST   | `/products` | Bearer + Admin | Create a product (multipart/form-data) |

#### Create Product

```
POST /api/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

Fields: name*, price*, category*, oldPrice, description, stock,
        rating, brand, shipping, featured, image (file)
```

---

## 🔐 Auth Middleware

All protected routes require the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

- **`protect`** — Validates the JWT and attaches `req.user`
- **`adminOnly`** — Restricts access to users with `role: "admin"`

---

## 🛠️ Tech Stack

| Layer      | Technology                                      |
|------------|------------------------------------------------|
| Runtime    | Node.js                                         |
| Framework  | Express 5                                        |
| Database   | MongoDB + Mongoose                               |
| Auth       | JWT (jsonwebtoken) + bcryptjs                    |
| Uploads    | Multer (memory) → Cloudinary                     |
| Frontend   | React 18 + Vite + Tailwind CSS                   |
| HTTP Client| Axios                                            |

---

<p align="center">
  Built by <a href="https://muhammadsheraz.dev/">Muhammad Sheraz</a>
</p>
