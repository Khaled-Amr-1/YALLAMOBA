import { Router } from "express";
const router = Router();
import pool from "../config/db.js"; // Import the pool from the config
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "posts", // Folder where files will be uploaded in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "gif", "mp4", "mov", "avi"], // Allowed file formats
    resource_type: "auto", // Auto-detect file type (image or video)
  },
});

const upload = multer({ storage });

router.post("/posts", upload.array("files", 10), async (req, res) => {
  const { body } = req.body; // Extract the body field from the request
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId; // Extract userId from the token

    if (!body || body.trim().length === 0) {
      return res.status(400).json({ error: "Body field is required" });
    }

    // Debugging: Log received files and body
    console.log("Files received:", req.files); // Log files
    console.log("Body content:", req.body); // Log body content

    let fileUrls = [];
    if (req.files.length > 0) {
      fileUrls = req.files.map((file) => file.path); // Cloudinary returns the file URL in `file.path`
    }

    const userResult = await pool.query(
      "SELECT username, avatar, uid FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const ownerData = userResult.rows[0];

    // Insert the post into the database
    await pool.query(
      "INSERT INTO posts (user_id, body, files) VALUES ($1, $2, $3)",
      [userId, body, fileUrls]
    );

    // Insert the post into the database and get the inserted post
    const insertResult = await pool.query(
      "INSERT INTO posts (user_id, body, files) VALUES ($1, $2, $3) RETURNING id, user_id, body, files, created_at",
      [userId, body, fileUrls]
    );

    const newPost = insertResult.rows[0];

    res.status(201).json({
      message: "Post created successfully",
      ownerData: ownerData,
      post: newPost, // return just the new post
    });
  } catch (error) {
    console.error("Error creating post:", error); // Log the full error
    res.status(500).json({ error: "Internal server error: " + error.message }); // Include error message
  }
});

router.delete("/posts/:id", async (req, res) => {
  const { id } = req.params; // Post ID to delete
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  // Verify and decode the token
  const decoded = jwt.verify(token, JWT_SECRET);
  const userId = decoded.userId; // Extract userId from the token

  // Fetch the post data from the database
  const postResult = await pool.query(
    "SELECT user_id FROM posts WHERE id = $1",
    [id]
  );

  if (postResult.rows.length === 0) {
    return res.status(404).json({ error: "Post not found" });
  }

  const post = postResult.rows[0];

  // Check if the user owns the post
  if (post.user_id !== userId) {
    return res
      .status(403)
      .json({ error: "Forbidden: Not authorized to delete this post" });
  }

  // Delete the post
  await pool.query("DELETE FROM posts WHERE id = $1", [id]);

  res.status(200).json({ message: "Post deleted successfully" });
});

export default router;
