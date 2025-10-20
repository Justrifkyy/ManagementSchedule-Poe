// middleware/checkAdmin.js
function checkAdmin(req, res, next) {
  // Middleware ini harus dijalankan SETELAH authenticateToken
  if (req.user && req.user.role === "ADMIN") {
    next(); // Jika user ada dan perannya ADMIN, lanjutkan
  } else {
    // Jika tidak, kirim error 403 Forbidden
    res.status(403).json({ message: "Access denied. Admin role required." });
  }
}

module.exports = checkAdmin;
