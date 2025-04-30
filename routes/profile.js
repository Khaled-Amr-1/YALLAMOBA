import { Router } from "express";
const router = Router();
import pool from "../config/db.js"; // Import the pool from the config
import dotenv from "dotenv";
dotenv.config();

router.get("/profile/:uid", async (req, res) => {
    const { uid } = req.params;
    const parsedUid = parseInt(uid, 10); // Convert uid to a number
    if (isNaN(parsedUid)) { // Check if parsedUid is a valid number
        return res.status(400).json({ error: "ENTER VALID ID" });
    }

    try {
        const result = await pool.query(
            "SELECT username, gender, role, avatar, uid, popularity FROM users WHERE uid = $1",
            [parsedUid] // Use the parsed number
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const user = result.rows[0];
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;