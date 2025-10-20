// middleware/authenticateToken.js
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  // 1. Ambil token dari header Authorization
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Formatnya "Bearer TOKEN"

  // 2. Jika tidak ada token, kirim error 401 Unauthorized
  if (token == null) {
    return res.sendStatus(401);
  }

  // 3. Verifikasi token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // Jika token tidak valid (error), kirim 403 Forbidden
    if (err) {
      return res.sendStatus(403);
    }

    // Jika token valid, simpan data user di object request
    req.user = user;

    // Lanjutkan ke proses selanjutnya (ke endpoint yang dituju)
    next();
  });
}

module.exports = authenticateToken;
