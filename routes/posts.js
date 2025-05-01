import { Router } from "express";
const router = Router();
import pool from "../config/db.js"; // Import the pool from the config
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

import { Router } from "express";
const router = Router();
import pool from "../config/db.js"; // Import the pool from the config
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/posts", async (req, res) => {
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

    // Insert the post into the database
    const result = await pool.query(
      "INSERT INTO posts (user_id, body) VALUES ($1, $2) RETURNING id, user_id, body, created_at",
      [userId, body]
    );

    const newPost = result.rows[0]; // Get the newly created post

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

router.delete("/posts/:id", async (req, res) => {
  const { id } = req.params; // Post ID to delete
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId; // Extract userId from the token

    // Fetch the post data from the database
    const postResult = await pool.query("SELECT user_id FROM posts WHERE id = $1", [id]);

    if (postResult.rows.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = postResult.rows[0];

    // Check if the user owns the post
    if (post.user_id !== userId) {
      return res.status(403).json({ error: "Forbidden: Not authorized to delete this post" });
    }

    // Delete the post
    await pool.query("DELETE FROM posts WHERE id = $1", [id]);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;