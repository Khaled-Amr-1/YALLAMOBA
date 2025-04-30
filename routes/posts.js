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
        const result = await pool.query(
            "SELECT id, body, files, created_at, updated_at FROM posts WHERE user_id = $1",
            [parsedUid] // Use the parsed uid
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No posts found for this user" });
        }

        // Return the posts as a response
        res.status(200).json({ posts: result.rows });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;