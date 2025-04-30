import { Router } from "express";
const router = Router();
import pool from "../config/db.js"; // Import the pool from the config
import dotenv from "dotenv";
dotenv.config();

router.get("/posts/:uid", async (req, res) => {
    const { uid } = req.params; // Extract uid from the URL
    const parsedUid = parseInt(uid, 10); // Convert uid to an integer

    if (isNaN(parsedUid)) { // Validate the uid
        return res.status(400).json({ error: "ENTER VALID ID" });
    }

    try {
        // Query the posts table for posts by the given user ID (uid)
        const postsResult = await pool.query(
            "SELECT body, files, created_at, updated_at FROM posts WHERE user_id = $1",
            [parsedUid] // Use the parsed uid
        );

        if (postsResult.rows.length === 0) {
            return res.status(404).json({ error: "No posts found for this user" });
        }

        // Query the users table for user details except for sensitive fields
        const userResult = await pool.query(
            "SELECT username, avatar, uid FROM users WHERE uid = $1",
            [parsedUid] // Use the parsed uid
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = userResult.rows[0]; // Get the user data
        const posts = postsResult.rows; // Get the user's posts

        // Return the posts and user data as a response
        res.status(200).json({ userPosts: posts, ownerData: user });
    } catch (error) {
        console.error("Error fetching posts or user data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;