// config/db.js
const mysql = require("mysql2");
require("dotenv").config();

// Membuat connection pool untuk efisiensi
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Ekspor promise-based pool agar bisa digunakan di file lain
module.exports = pool.promise();
