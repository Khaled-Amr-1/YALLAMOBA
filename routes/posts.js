import { Router } from "express";
const router = Router();
import pool from "../config/db.js"; // Import the pool from the config
import dotenv from "dotenv";
dotenv.config();

router.get("/posts/", async (req, res) => {
    res.json({ message: "This is posts" })});

export default router;