// middleware/checkAdmin.js
function checkAdmin(req, res, next) {
  // Middleware ini harus dijalankan SETELAH authenticateToken
  if (req.user && req.user.role === "ADMIN") {
    next(); // Lanjutkan jika pengguna adalah ADMIN
  } else {
    res.status(403).json({ message: "Akses ditolak. Hanya untuk Admin." });
  }
}

module.exports = checkAdmin;
