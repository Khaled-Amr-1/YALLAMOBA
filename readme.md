# API Documentation

This document provides an overview of the API endpoints for managing users, posts, and profiles. It includes examples of requests and responses for easy integration with the frontend.

---

## **Authentication**
### **Token Usage**
All endpoints (except `/register` and `/login`) require a valid JWT token to be provided in the `Authorization` header. Format:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## **Users API**
### **Register a New User**
**Endpoint:** `POST /register`

**Description:** Create a new user account.

**Request Body:**
```json
{
  "username": "exampleuser",
  "email": "example@example.com",
  "password": "password123",
  "repassword": "password123",
  "gender": "male",
  "role": "user",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response:**
```json
{
  "UserToken": "<JWT_TOKEN>",
  "UserData": {
    "username": "exampleuser",
    "email": "example@example.com",
    "gender": "male",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg",
    "UID": "1000001",
    "mobaCoin": 0,
    "popularity": 0
  }
}
```

---

### **Login**
**Endpoint:** `POST /login`

**Description:** Authenticate a user.

**Request Body:**
```json
{
  "identifier": "example@example.com", // or "exampleuser"
  "password": "password123"
}
```

**Response:**
```json
{
  "UserToken": "<JWT_TOKEN>",
  "UserData": {
    "username": "exampleuser",
    "email": "example@example.com",
    "gender": "male",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg",
    "UID": "1000001",
    "mobaCoin": 0,
    "popularity": 0
  }
}
```

---

## **Posts API**
### **Create a Post**
**Endpoint:** `POST /posts`

**Description:** Create a new post with optional image or video uploads.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Request (Form Data):**
- **Key:** `body` (type: Text) - Content of the post.
- **Key:** `files` (type: File) - Up to 10 files (images/videos).

**Example (Postman Form-Data):**
- `body`: `This is a post with an image.`
- `files`: (attach an image or video file).

**Response:**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": 1,
    "user_id": 50,
    "body": "This is a post with an image.",
    "files": [
      "https://res.cloudinary.com/demo/image/upload/v1234567890/posts/image1.jpg"
    ],
    "created_at": "2025-05-01T12:00:00Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: `{"error": "Unauthorized: No token provided"}`
- `400 Bad Request`: `{"error": "Body field is required"}`
- `400 Bad Request`: `{"error": "No files were uploaded"}`

---

### **Delete a Post**
**Endpoint:** `DELETE /posts/:id`

**Description:** Delete a post by its ID.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "message": "Post deleted successfully"
}
```

**Error Responses:**
- `404 Not Found`: `{"error": "Post not found"}`
- `403 Forbidden`: `{"error": "Forbidden: Not authorized to delete this post"}`
- `401 Unauthorized`: `{"error": "Unauthorized: No token provided"}`

---

## **Profile API**
### **Get a User Profile**
**Endpoint:** `GET /profile/:uid`

**Description:** Retrieve user profile information and their posts.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "ownerData": {
    "id": 50,
    "username": "exampleuser",
    "gender": "male",
    "role": "user",
    "avatar": "https://example.com/avatar.jpg",
    "uid": "1000001",
    "popularity": 100
  },
  "ownerPosts": [
    {
      "user_id": 50,
      "body": "This is a sample post.",
      "files": [
        "https://res.cloudinary.com/demo/image/upload/v1234567890/posts/image1.jpg"
      ],
      "created_at": "2025-05-01T12:00:00Z",
      "updated_at": "2025-05-01T12:30:00Z"
    }
  ]
}
```

**Error Responses:**
- `404 Not Found`: `{"error": "User not found"}`
- `500 Internal Server Error`: `{"error": "Internal server error: <details>"}`

---

## **Error Handling**
- **401 Unauthorized:** Token is missing or invalid.
- **400 Bad Request:** Missing required fields or invalid input.
- **404 Not Found:** Resource not found (e.g., user or post).
- **500 Internal Server Error:** Unexpected server-side error.

---

## **Notes for Frontend Integration**
1. **Authorization:**
   - All protected routes (`/posts`, `/profile/:uid`, etc.) require a valid JWT token.
   - The token must be included in the `Authorization` header.

2. **File Uploads:**
   - Use `multipart/form-data` for file uploads.
   - Ensure the `files` field matches the backend configuration.

3. **Date Format:**
   - All date fields (e.g., `created_at`, `updated_at`) are in ISO 8601 format (`YYYY-MM-DDTHH:mm:ssZ`).

4. **Error Responses:**
   - Always handle error responses gracefully on the frontend. Display appropriate messages to the user based on the error type.

---

## **Environment Variables**
The following environment variables must be set for the APIs to work:
- `JWT_SECRET`: Secret key for JWT token generation.
- `CLOUDINARY_CLOUD_NAME`: Cloudinary account name.
- `CLOUDINARY_API_KEY`: Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Cloudinary API secret.

---

## **Future Enhancements**
- Add pagination for user posts in `/profile/:uid`.
- Add support for editing posts.
- Implement user profile updates.
