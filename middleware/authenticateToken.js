import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export function authenticateToken(req, res, next) {
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
      console.log("Token verified successfully:", user);
      
      req.user = user;
      next();
    });
  }