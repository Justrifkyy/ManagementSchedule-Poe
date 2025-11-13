require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./config/db");
const authenticateToken = require("./middleware/authenticateToken");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// === ROUTES ===

// Endpoint untuk registrasi pengguna baru
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "Username, email, password, and role are required." });
    }

    if (role === "ADMIN" || !["ORGANIZER", "PARTICIPANT"].includes(role)) {
      return res.status(400).json({ message: "Invalid role selected." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
    await db.execute(query, [username, email, hashedPassword, role]);

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Username or email already exists." });
    }
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint untuk Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const query = "SELECT * FROM users WHERE email = ?";
    const [users] = await db.execute(query, [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const user = users[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful!", token: token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// =======================================================
// ## PERBAIKAN: Endpoint GET /profile mengambil data lengkap dari DB ##
// =======================================================
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    // Ambil data terbaru dari database, bukan hanya dari token
    const query = "SELECT id, username, email, role, full_name, address, bio FROM users WHERE id = ?";
    const [users] = await db.execute(query, [req.user.id]);

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(users[0]); // Kirim data profil yang lengkap
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// =======================================================
// ## BARU: Endpoint PUT /profile untuk menyimpan perubahan data diri ##
// =======================================================
app.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { full_name, address, bio } = req.body;
    const userId = req.user.id;

    const query = "UPDATE users SET full_name = ?, address = ?, bio = ? WHERE id = ?";
    await db.execute(query, [full_name, address, bio, userId]);

    res.json({ message: "Profile updated successfully." });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// =======================================================
// ## ENDPOINT BARU: AMBIL DAFTAR USER UNTUK DIUNDANG ##
// =======================================================
app.get('/users', authenticateToken, async (req, res) => {
  // Pastikan hanya Admin yang bisa melihat daftar pengguna
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied.' });
  }

  try {
    // Ambil semua pengguna yang BUKAN ADMIN
    const query = "SELECT id, username, email, role FROM users WHERE role != 'ADMIN'";
    const [users] = await db.execute(query);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Auth service is running on http://localhost:${PORT}`);
});
