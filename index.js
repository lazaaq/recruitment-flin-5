const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db");
require("dotenv").config();

const app = express();
app.use(express.json());

// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (users.length > 0) return res.status(400).json({ message: "Username already taken." });

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword]);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
    if (users.length === 0) return res.status(400).json({ message: "User not found." });

    const valid = await bcrypt.compare(password, users[0].password);
    if (!valid) return res.status(401).json({ message: "Incorrect password." });

    const token = jwt.sign({ id: users[0].id, username: users[0].username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware to authenticate JWT
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    next();
  });
};

// Profile route
app.get("/profile", authenticate, async (req, res) => {
  try {
    const [users] = await pool.query("SELECT id, username FROM users WHERE id = ?", [req.user.id]);
    if (users.length === 0) return res.status(404).json({ message: "User not found" });

    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
