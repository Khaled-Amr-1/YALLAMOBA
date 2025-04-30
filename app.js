import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/users.js"; // Import the user routes

import cors from "cors"; // Import cors
// import pkg from 'pg';
// const { Pool } = pkg;
import dotenv from "dotenv";
import { authenticateToken } from "./middleware/authenticateToken.js"; // Import the authentication middleware

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000", // Allow requests from localhost:3000
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
  credentials: true // Allow sending cookies or authentication headers
}));

app.use(bodyParser.json());

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

const JWT_SECRET = process.env.JWT_SECRET;

app.use("/api", userRoutes); // Use the user routes


// app.get("/users", async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM users");
//     res.json(result.rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" + error});
//   }
// });


// app.post("/register", async (req, res) => {
//   const { username, email, password, repassword, gender, role, avatar } = req.body; // Added gender, role, and avatar
//   try {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({ error: "Invalid email format" });
//     }
//     if(!username || !email || !password || !gender || !role || !avatar){
//       return res.status(400).json({ error: "All fields are required" });
//     }
//     if(username.length < 6){
//       return res.status(400).json({error: "username must be at least 6 characters long"})
//     }
//     if(password.length < 8){
//       return res.status(400).json({ error: "Password must be at least 8 characters long" });
//     }
//     if(password != repassword){
//       return res.status(400).json({ error: "Passwords do not match" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     // Check if the email already exists
//     const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
//     if (emailCheck.rows.length > 0) {
//       return res.status(400).json({ error: "Email already exists" });
//     }
//     const result = await pool.query(
//       "INSERT INTO users (username, email, password, gender, role, avatar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, gender, role, avatar",
//       [username, email, hashedPassword, gender, role, avatar] // Added the new fields here
//     );

//     const user = result.rows[0]; // Extract the user data from the query result

//     const UserToken = jwt.sign(
//       { userId: user.id },
//       JWT_SECRET,
//       { expiresIn: "3000h" }
//     );

//     // Return the user data and the token
//     res.status(201).json({
//       UserToken,
//       UserData: {
//         username: user.username,
//         email: user.email,
//         gender: user.gender,
//         role: user.role,
//         avatar: user.avatar,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error: " + error });
//   }
// });
// app.post("/login", async (req, res) => {
//   const { identifier, password } = req.body; // Use "identifier" instead of "email" to support email or username
//   if (!identifier || !password) {
//     return res.status(400).json({ error: " (email or username) and password are required" });
//   }

//   try {
//     // Query the database to check if the identifier matches either email or username
//     const result = await pool.query(
//       "SELECT id, username, email, password, gender, role, avatar FROM users WHERE email = $1 OR username = $1",
//       [identifier]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({ error: "Wrong email, username, or password!" });
//     }

//     const user = result.rows[0]; // Extract the user data from the query result

//     // Verify the password
//     const isValidPassword = await bcrypt.compare(password, user.password);
//     if (!isValidPassword) {
//       return res.status(401).json({ error: "Wrong email, username, or password!" });
//     }

//     // Generate a token for the user
//     const UserToken = jwt.sign(
//       { userId: user.id },
//       JWT_SECRET,
//       { expiresIn: "3000h" }
//     );

//     // Return the user data and the token
//     res.json({
//       UserToken,
//       UserData: {
//         username: user.username,
//         email: user.email,
//         gender: user.gender,
//         role: user.role,
//         avatar: user.avatar,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error: " + error });
//   }
// });


app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", userId: req.user.userId });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
