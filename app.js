const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const JWT_SECRET = process.env.JWT_SECRET;

app.get("/", (req, res) => {
  res.send("Welcome to the API");
}
);

app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" + error});
  }
});


app.post("/register", async (req, res) => {
  const { username, email, password, repassword, gender, role, avatar } = req.body; // Added gender, role, and avatar
  try {
    if(password != repassword){
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, email, password, gender, role, avatar) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, gender, role, avatar",
      [username, email, hashedPassword, gender, role, avatar] // Added the new fields here
    );

    const user = result.rows[0]; // Extract the user data from the query result

    const UserToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "3000h" }
    );

    // Return the user data and the token
    res.status(201).json({
      UserToken,
      UserData: {
        username: user.username,
        email: user.email,
        gender: user.gender,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error: " + error });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT id, username, email, password, gender, role, avatar FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = result.rows[0]; // Extract the user data from the query result

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const UserToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: "3000h" }
    );

    // Return the user data and the token
    res.json({
      UserToken,
      UserData: {
        username: user.username,
        email: user.email,
        gender: user.gender,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error: " + error });
  }
});

function authenticateToken(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1]; // Get token without "Bearer"
    if (!token) {
      console.error("No token provided");
      return res.status(401).json({ error: "Unauthorized" });
    }
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.error("Token verification failed:", err);
        return res.status(403).json({ error: "Forbidden" });
      }
      req.user = user;
      next();
    });
  }
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "This is a protected route", userId: req.user.userId });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
