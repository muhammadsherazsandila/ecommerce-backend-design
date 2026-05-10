# E-Commerce Backend Design

Full-stack e-commerce project with a Node.js/Express API and a React/Vite frontend.

## Overview

This repository contains:

- `backend`: Express 5 REST API with MongoDB/Mongoose, JWT auth, role-based access (`user`/`admin`), and Cloudinary image upload support.
- `frontend`: React 18 + Vite app that consumes the backend API through Axios.

## Project Structure

```text
ecommerce-backend-design/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   │   ├── cloudinary.js
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── productController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   ├── models/
│   │   │   ├── Product.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   └── index.js
│   │   └── scripts/
│   │       └── seed.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api.js
│   │   ├── components/
│   │   └── context/
│   └── package.json
└── README.md
```

## Features

- User signup/login with hashed passwords (`bcryptjs`) and JWT tokens.
- Protected profile endpoint (`GET /api/auth/me`).
- Admin-only product creation endpoint with optional multipart image upload.
- Product listing with pagination, search, and filtering.
- Homepage endpoint that returns categories, featured, recommended, and category sections in one request.
- Seed script that fetches sample products from external APIs and creates test users.

## Prerequisites

- Node.js 18+
- npm
- MongoDB instance (local or Atlas)
- Cloudinary account (recommended for image uploads and seeding)

## Environment Variables

Create `backend/.env`:

```env
PORT=3000
HOST=localhost
CORS_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=replace_with_strong_secret
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Optional frontend environment (`frontend/.env`):

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

If `VITE_API_BASE_URL` is not set, the frontend defaults to `http://localhost:3000/api`.

## Installation and Run

From repository root:

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

3. Start backend (terminal 1):

```bash
cd ../backend
npm run dev
```

4. Start frontend (terminal 2):

```bash
cd ../frontend
npm run dev
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- API base: `http://localhost:3000/api`

## Backend Scripts

In `backend`:

- `npm run dev` - Run API with nodemon.
- `npm start` - Run API with Node.
- `npm run seed` - Seed products and users.

## Frontend Scripts

In `frontend`:

- `npm run dev` - Start Vite dev server.
- `npm run build` - Build production bundle.
- `npm run preview` - Preview built app.

## API Endpoints

Base path: `/api`

Health and root:

- `GET /` - API welcome message.
- `GET /health` - Health status with uptime.
- `GET /api/` - API routes ready message.

Auth:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token required)

Products (public):

- `GET /api/products`
- `GET /api/products/search`
- `GET /api/products/homepage`
- `GET /api/products/featured`
- `GET /api/products/categories`
- `GET /api/products/:id`

Products (protected):

- `POST /api/products` (Bearer token + admin role)

`GET /api/products` query parameters:

- `page` (default `1`)
- `limit` (default `12`, max `50`)
- `search`
- `category`
- `brand`
- `minPrice`
- `maxPrice`
- `featured` (`true` to filter featured)
- `sort` (default `-createdAt`)

`GET /api/products/search` query parameters:

- `q`
- `category`
- `limit` (default `10`, max `20`)

## Seed Data

Run `npm run seed` in `backend` to:

- Clear existing products and users.
- Fetch products from DummyJSON and FakeStoreAPI.
- Upload product images to Cloudinary (falls back to source image URL if upload fails).
- Create demo users:
  - Admin: `admin@ecommerce.com` / `admin123`
  - User: `user@ecommerce.com` / `user123`

## Tech Stack

- Backend: Node.js, Express 5, Mongoose, JWT, bcryptjs, multer, cloudinary, cors, compression
- Frontend: React 18, Vite, Tailwind CSS, Axios, React Router

## Author

- Muhammad Sheraz: https://muhammadsheraz.dev/
