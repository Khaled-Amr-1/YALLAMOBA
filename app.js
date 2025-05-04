import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/users.js"; // Import the user routes
import profileRoutes from "./routes/profile.js"; // Import the user routes
import postRoutes from "./routes/posts.js"; // Import the user routes

import cors from "cors"; // Import cors
import dotenv from "dotenv";
import { authenticateToken } from "./middleware/authenticateToken.js"; // Import the authentication middleware

dotenv.config();


import { errorHandler } from "./middleware/errorHandler.js"; // Import the error handler



const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from localhost:3000
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow sending cookies or authentication headers
  })
);

app.use(bodyParser.json());

app.use("/api", userRoutes); // Use the user routes
app.use("/api",authenticateToken, profileRoutes); // Use the user routes
app.use("/api",authenticateToken, postRoutes); // Use the user routes

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", userId: req.user.userId , uid: req.user.UID});
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
