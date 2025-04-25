# API Documentation

This API provides functionality for user registration, login, and protected routes. Below is the detailed documentation of the endpoints and how to use them.

---

## Base URL:
- **Local Development**: `http://localhost:3000`

---

## General Information:
- The API uses JWT for authentication.
- CORS is enabled for requests from `http://localhost:3000`.
- All endpoints accept and respond with JSON data.

---

## Endpoints:

### 1. `GET /`
**Description**: Welcome route to verify if the API is running.

**Response**:
```json
{
  "message": "Welcome to the API"
}
```

---

### 2. `GET /users`
**Description**: Fetch a list of all users.

**Response**:
Returns an array of user objects (excluding sensitive information like passwords).

**Example Response**:
```json
[
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "gender": "male",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg"
  }
]
```

---

### 3. `POST /register`
**Description**: Register a new user.

**Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword",
  "repassword": "securepassword",
  "gender": "male",
  "role": "user",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Validation Rules**:
- `username`: Must be at least 6 characters long.
- `password`: Must be at least 8 characters long.
- `repassword`: Must match the `password`.
- `email`: Must be a valid email format.
- All fields are required.

**Response**:
Returns a token and user data.

**Example Response**:
```json
{
  "UserToken": "your.jwt.token.here",
  "UserData": {
    "username": "john_doe",
    "email": "john@example.com",
    "gender": "male",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

---

### 4. `POST /login`
**Description**: Log in a user using their email or username and password.

**Request Body**:
```json
{
  "identifier": "john_doe", // Can be email or username
  "password": "securepassword"
}
```

**Response**:
Returns a token and user data.

**Example Response**:
```json
{
  "UserToken": "your.jwt.token.here",
  "UserData": {
    "username": "john_doe",
    "email": "john@example.com",
    "gender": "male",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

**Error Response**:
- If the `identifier` or `password` is missing:
  ```json
  {
    "error": " (email or username) and password are required"
  }
  ```
- If the credentials are incorrect:
  ```json
  {
    "error": "Wrong email, username, or password!"
  }
  ```

---

### 5. `GET /protected`
**Description**: Access a protected route (requires a valid token).

**Headers**:
```json
{
  "Authorization": "Bearer your.jwt.token.here"
}
```

**Response**:
```json
{
  "message": "This is a protected route",
  "userId": 1
}
```

**Error Response**:
- If no token is provided:
  ```json
  {
    "error": "Unauthorized"
  }
  ```
- If the token is invalid:
  ```json
  {
    "error": "Forbidden"
  }
  ```

---

## Authentication:

The API uses JWT for authentication. Include the token in the `Authorization` header for protected routes.

**Example Header**:
```json
{
  "Authorization": "Bearer your.jwt.token.here"
}
```

---

## CORS Configuration:
- Allowed Origin: `http://localhost:3000`
- Allowed Methods: `GET`, `POST`, `PUT`, `DELETE`
- Credentials: Allowed

---

## Environment Variables:
The following environment variables are required to run the API:

| Variable        | Description                           |
|------------------|---------------------------------------|
| `DB_USER`       | Your PostgreSQL database username     |
| `DB_HOST`       | Your PostgreSQL host address          |
| `DB_NAME`       | Your PostgreSQL database name         |
| `DB_PASSWORD`   | Your PostgreSQL password              |
| `DB_PORT`       | Your PostgreSQL port (default: 5432)  |
| `JWT_SECRET`    | Secret key for signing JWTs           |

---

## Running the Server:
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   node index.js
   ```
3. The server will run on `http://localhost:3000`.

---

Let me know if you have any questions or need further clarification!