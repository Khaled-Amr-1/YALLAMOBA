import { Router } from "express";
const router = Router();
import pool from "../config/db.js"; // Import the pool from the config
import dotenv from "dotenv";
dotenv.config();

router.get("test", async (req, res) => {
    res.json({ message: "This is a test route" });
  }
);


export default profileRoutes;

