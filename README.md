# Premetrade Backend

A Node.js / Express.js REST API backend for the Premetrade application, featuring user authentication, profile management, and task management with MongoDB.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation &amp; Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [User Profile](#user-profile)
  - [Tasks](#tasks)
- [Authentication](#authentication-details)
- [File Uploads](#file-uploads)
- [Database Models](#database-models)
- [Error Handling](#error-handling)
- [Development](#development)
- [Deployment](#deployment)

---

## Features

✅ **User Authentication** – Register, login with JWT tokens (24-hour expiry)
✅ **Profile Management** – Get and update user profiles (name, photo)
✅ **Photo Uploads** – Upload and manage user photos with multer
✅ **Task Management** – Create, read, update, delete tasks (user-specific)
✅ **Password Security** – Bcrypt hashing with salt rounds (10)
✅ **CORS Enabled** – Cross-origin requests supported
✅ **Validation** – Input validation for required fields

---

## Tech Stack

| Layer                      | Technology                |
| -------------------------- | ------------------------- |
| **Runtime**          | Node.js (ES6+ modules)    |
| **Framework**        | Express.js v5.2.1         |
| **Database**         | MongoDB (Mongoose v9.0.0) |
| **Authentication**   | JWT (jsonwebtoken v9.0.2) |
| **Password Hashing** | bcryptjs v3.0.3           |
| **File Upload**      | Multer v2.0.2             |
| **Environment**      | dotenv v17.2.3            |
| **CORS**             | cors v2.8.5               |
| **Development**      | Nodemon v3.1.11           |

---

## Project Structure

```
backend/
├── server.js                 # Express app entry point, middleware setup
├── package.json              # Dependencies and scripts
├── .env                      # Environment variables (not in Git)
├── .gitignore                # Git ignore patterns
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   ├── User.js               # User schema (name, email, password, photo)
│   └── Task.js               # Task schema (title, description, user, createdAt)
├── controllers/
│   └── authController.js     # Register, login, and multer setup
├── middleware/
│   └── authMiddleware.js     # JWT verification middleware
├── routes/
│   ├── authRoutes.js         # POST /register, /login
│   ├── userRoutes.js         # GET /profile, PUT /profile
│   └── taskRoutes.js         # CRUD endpoints for tasks
└── uploads/                  # Uploaded photos (served statically)
```

---

## Installation & Setup

### Prerequisites

- **Node.js** v16+ and npm
- **MongoDB** Compass
- **Git** for version control

### Steps

1. **Clone the repository** (or extract from your machine):

   ```powershell
   cd C:\Users\abdul\premetrade_backend\backend
   ```
2. **Install dependencies**:

   ```powershell
   npm install
   ```
3. **Create `.env` file** in the `backend/` folder:

   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_key_here
   PORT=5000
   ```
4. **Start the development server**:

   ```powershell
   npm run dev
   ```

   Expected output:

   ```
   [dotenv] injecting env from .env
   Server running on http://localhost:5000
   MongoDB Connected
   ```

---

## Environment Variables

| Variable       | Description                       | Example                                                    |
| -------------- | --------------------------------- | ---------------------------------------------------------- |
| `MONGO_URI`  | MongoDB connection string         | `mongodb+srv://user:pass@cluster.mongodb.net/premetrade` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_random_secret_key_12345`                           |
| `PORT`       | Server port (optional)            | `5000`                                                   |

**⚠️ Important**: Do NOT commit `.env` to Git. Use GitHub Secrets for CI/CD deployments.

---

## API Endpoints

### Base URL

```
http://localhost:5000
```

### Authentication

#### 1. Register User

**POST** `/api/auth/register`

Create a new user account with optional photo upload.

**Request** (multipart/form-data):

```
name: "John Doe"           (Text)
email: "john@example.com"  (Text)
password: "secret123"      (Text)
photo: [file]              (File, optional)
```

**Response** (201 Created):

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "photo": "/uploads/1690000000.png"
  }
}
```

**Error** (400):

```json
{
  "message": "Name, email and password are required"
}
```

---

#### 2. Login User

**POST** `/api/auth/login`

Authenticate and receive a JWT token.

**Request** (application/json):

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response** (200 OK):

```json
{
  "message": "Login Successfull",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "photo": "/uploads/1690000000.png"
}
```

**Error** (400):

```json
{
  "message": "Invalid Email or Password"
}
```

---

### User Profile

#### 3. Get User Profile

**GET** `/api/user/profile`

Retrieve authenticated user's profile (password excluded).

**Headers**:

```
Authorization: Bearer <token>
```

**Response** (200 OK):

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "photo": "/uploads/1690000000.png",
  "createdAt": "2024-12-04T10:30:00.000Z",
  "updatedAt": "2024-12-04T10:30:00.000Z"
}
```

**Error** (401):

```json
{
  "message": "No token provided"
}
```

---

#### 4. Update User Profile

**PUT** `/api/user/profile`

Update user name and/or photo. Old uploaded photos are automatically cleaned up.

**Headers**:

```
Authorization: Bearer <token>
```

**Request** (multipart/form-data):

```
name: "Jane Doe"  (Text, optional)
photo: [file]     (File, optional)
```

**Response** (200 OK):

```json
{
  "message": "Profile updated",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Jane Doe",
    "email": "john@example.com",
    "photo": "/uploads/1690000001.png",
    "createdAt": "2024-12-04T10:30:00.000Z",
    "updatedAt": "2024-12-04T11:00:00.000Z"
  }
}
```

---

### Tasks

All task endpoints require authentication via `Authorization: Bearer <token>` header.

#### 5. Create Task

**POST** `/api/task`

Create a new task for the authenticated user.

**Request** (application/json):

```json
{
  "title": "Complete project",
  "description": "Finish the backend API"
}
```

**Response** (201):

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Complete project",
  "description": "Finish the backend API",
  "user": "507f1f77bcf86cd799439011",
  "createdAt": "2024-12-04T10:30:00.000Z"
}
```

---

#### 6. Get All Tasks

**GET** `/api/task`

Retrieve all tasks for the authenticated user.

**Response** (200 OK):

```json
{
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Complete project",
      "description": "Finish the backend API",
      "user": "507f1f77bcf86cd799439011",
      "createdAt": "2024-12-04T10:30:00.000Z"
    }
  ]
}
```

---

#### 7. Update Task

**PUT** `/api/task/:id`

Update a specific task (title and/or description).

**Request** (application/json):

```json
{
  "title": "Updated title",
  "description": "Updated description"
}
```

**Response** (200 OK):

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "title": "Updated title",
  "description": "Updated description",
  "user": "507f1f77bcf86cd799439011",
  "createdAt": "2024-12-04T10:30:00.000Z"
}
```

---

#### 8. Delete Task

**DELETE** `/api/task/:id`

Delete a specific task.

**Response** (200 OK):

```json
{
  "message": "Task Deleted"
}
```

---

## Authentication Details

### JWT Token Flow

1. **User registers/logs in** → Server creates JWT token signed with `JWT_SECRET`
2. **Token expires in 24 hours** → User must login again after expiry
3. **Client stores token** → Include in `Authorization: Bearer <token>` header for protected routes
4. **Server verifies token** → `authMiddleware` checks signature and expiry before granting access

### Token Payload

```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "name": "John Doe"
}
```

### Protected Routes

Routes that require `authMiddleware`:

- `GET /api/user/profile`
- `PUT /api/user/profile`
- `POST /api/task`
- `GET /api/task`
- `PUT /api/task/:id`
- `DELETE /api/task/:id`

---

## File Uploads

### Multer Configuration

- **Storage**: Disk storage to `uploads/` folder
- **Filename**: `<timestamp><file-extension>` (e.g., `1690000000.png`)
- **Usage**: Single photo per request via `upload.single('photo')`
- **Routes**: `/api/auth/register`, `/api/user/profile`

### Upload Workflow

1. Form sends multipart/form-data with `photo` field
2. Multer writes file to `backend/uploads/<timestamp>.<ext>`
3. Express static middleware serves from `/uploads`
4. Database stores path: `/uploads/<timestamp>.<ext>`

### Access Uploaded Files

```
Browser: http://localhost:5000/uploads/1690000000.png
Server: C:\Users\abdul\premetrade_backend\backend\uploads\1690000000.png
```

### Cleanup

When updating profile with a new photo, old local uploads are automatically deleted from disk.

---

## Database Models

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  photo: String (optional, default: placeholder URL),
  timestamps: true
}
```

### Task Model

```javascript
{
  title: String (required),
  description: String (optional),
  user: ObjectId (reference to User, required),
  createdAt: Date (default: Date.now)
}
```

---

## Error Handling

### Common Error Responses

| Status        | Message                               | Cause                        |
| ------------- | ------------------------------------- | ---------------------------- |
| **400** | Name, email and password are required | Missing register field       |
| **400** | Email already exists                  | Duplicate email on register  |
| **400** | Invalid Email or Password             | Wrong credentials on login   |
| **401** | No token provided                     | Missing Authorization header |
| **401** | Invalid or expired token              | Bad/expired JWT token        |
| **404** | User not found                        | User ID doesn't exist        |
| **500** | error.message                         | Server or database error     |

### Example Error Response

```json
{
  "message": "Invalid Email or Password"
}
```

---

## Development

### Available Scripts

**Start development server** (with auto-reload):

```powershell
npm run dev
```

**Install dependencies**:

```powershell
npm install
```

### Console Logging

The app logs important events:

```
[dotenv] injecting env from .env
Server running on http://localhost:5000
MongoDB Connected
registerUser - req.body: {...} req.file: {...}  (debug info)
```

### Debugging Tips

- **Check server logs** for validation and database errors
- **Enable/disable console.log statements** in controllers
- **Use Postman/cURL** to test endpoints and verify response
- **Monitor MongoDB** in Atlas dashboard for data changes

---

## Deployment

### Prerequisites for Deployment

1. Set up production MongoDB instance (MongoDB Atlas recommended)
2. Generate strong `JWT_SECRET` (use a random key generator)
3. Configure environment variables in deployment platform (Heroku, Vercel, Railway, etc.)

### Steps

1. **Push to GitHub** (see below)
2. **Connect to deployment platform**
3. **Set environment variables** in platform dashboard
4. **Deploy** (auto-deploy on push or manual)

### Git Push Instructions (PowerShell)

```powershell
cd C:\Users\abdul\premetrade_backend\backend

# Initialize and commit
git init
git add .
git commit -m "Initial commit: Premetrade backend API"
git branch -M main

# Add remote and push
git remote add origin https://github.com/AbdulMaaz909/premetrade_backend.git
git push -u origin main
```

### Recommended Deployment Platforms

- **Railway** (simple, free tier) – `railway link` → deploy
- **Render** (free tier, auto-deploys)
- **Vercel** (serverless) – not ideal for stateful APIs
- **Heroku** (classic, paid after free tier ended)
- **DigitalOcean App Platform** (affordable, reliable)

### Example `.env` for Production

```
MONGO_URI=mongodb+srv://produser:prodpass@cluster.mongodb.net/premetrade_prod?retryWrites=true&w=majority
JWT_SECRET=generate-a-random-secret-key-here-min-32-chars
PORT=5000
```

---

## File Structure Summary

| File                              | Purpose                                |
| --------------------------------- | -------------------------------------- |
| `server.js`                     | Express app, middleware, route imports |
| `config/db.js`                  | MongoDB connection                     |
| `models/User.js`                | User schema definition                 |
| `models/Task.js`                | Task schema definition                 |
| `controllers/authController.js` | Register, login, multer setup          |
| `middleware/authMiddleware.js`  | JWT verification                       |
| `routes/authRoutes.js`          | `/register`, `/login` endpoints    |
| `routes/userRoutes.js`          | `/profile` GET/PUT endpoints         |
| `routes/taskRoutes.js`          | `/` CRUD task endpoints              |
| `uploads/`                      | Static folder for user photos          |
| `.env`                          | Secrets (not committed)                |
| `.gitignore`                    | Exclude node_modules, .env, etc.       |
| `README.md`                     | This documentation                     |

---

## Notes

- **Security**: Store `JWT_SECRET` securely; never commit `.env`
- **Photos**: Uploaded files are served from `/uploads` and deleted when replaced
- **Validation**: Basic validation present; consider adding more strict validations for production
- **CORS**: Enabled globally; adjust origins in production as needed
- **Rate Limiting**: Not implemented; add for production APIs

---

## License

ISC

---

## Support

For issues or questions, check server logs first and verify MongoDB connection.
