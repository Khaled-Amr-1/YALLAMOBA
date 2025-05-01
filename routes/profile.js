import { Router } from "express";
const router = Router();
import pool from "../config/db.js"; // Import the pool from the config
import dotenv from "dotenv";
dotenv.config();
// import jwt from "jsonwebtoken";
router.get("/profile/:uid", async (req, res) => {
    const { uid } = req.params;
    const parsedUid = parseInt(uid, 10); // Convert uid to a number
    if (isNaN(parsedUid)) {
      return res.status(400).json({ error: "ENTER VALID ID" });
    }
  
    try {
      // Fetch user data
      const userResult = await pool.query(
        "SELECT id, username, gender, role, avatar, uid, popularity FROM users WHERE uid = $1",
        [parsedUid]
      );
  
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const user = userResult.rows[0];
  
      // Fetch user posts using the user's internal `id`
      const postsResult = await pool.query(
        "SELECT id, body, files, created_at, updated_at FROM posts WHERE user_id = $1",
        [user.id] // Use the `id` fetched from the first query
      );
  
      const ownerPosts = postsResult.rows;
      delete user.id;
      res.status(200).json({ ownerData: user, ownerPosts });
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

export default router;