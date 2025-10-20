// attendance-service/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const authenticateToken = require("./middleware/authenticateToken");
const checkAdmin = require("./middleware/checkAdmin");

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Endpoint untuk konfirmasi atau mengubah status kehadiran
// attendance-service/index.js -> di dalam app.post('/attendances', ...)

app.post('/attendances', authenticateToken, async (req, res) => {
  try {
    const { schedule_id, status } = req.body;
    const user_id = req.user.id;
    const validStatuses = ['ATTENDING', 'NOT_ATTENDING', 'COMPLETED', 'MISSED'];

    if (!schedule_id || !status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'schedule_id and a valid status are required.' });
    }

    // --- VALIDASI LOGIKA WAKTU BARU ---
    // 1. Ambil waktu jadwal dari database
    const [schedules] = await db.execute('SELECT schedule_time FROM schedules WHERE id = ?', [schedule_id]);
    if (schedules.length === 0) {
      return res.status(404).json({ message: 'Schedule not found.' });
    }
    const scheduleTime = new Date(schedules[0].schedule_time);
    const now = new Date();

    // 2. Terapkan aturan
    if (['ATTENDING', 'NOT_ATTENDING'].includes(status) && scheduleTime < now) {
      return res.status(400).json({ message: 'Cannot change attendance for a past event.' });
    }
    if (['COMPLETED', 'MISSED'].includes(status) && scheduleTime > now) {
      return res.status(400).json({ message: 'Cannot mark a future event as completed or missed.' });
    }
    // --- AKHIR VALIDASI ---

    const query = `
      INSERT INTO attendances (schedule_id, user_id, status)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE status = ?
    `;

    await db.execute(query, [schedule_id, user_id, status, status]);
    res.status(200).json({ message: `Attendance status updated to ${status}` });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Endpoint untuk mengambil laporan kehadiran (hanya untuk Admin)
app.get("/attendances/report/:scheduleId", authenticateToken, checkAdmin, async (req, res) => {
  try {
    const { scheduleId } = req.params;

    const query = `
      SELECT 
        s.title AS schedule_title,
        u.username,
        u.email,
        a.status,
        a.updated_at
      FROM attendances a
      JOIN users u ON a.user_id = u.id
      JOIN schedules s ON a.schedule_id = s.id
      WHERE a.schedule_id = ?
    `;

    const [reportData] = await db.execute(query, [scheduleId]);

    if (reportData.length === 0) {
      return res.status(404).json({ message: "No attendance data found for this schedule." });
    }

    res.json(reportData);
  } catch (error) {
    console.error("Get attendance report error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// =======================================================
// ## ENDPOINT BARU: AMBIL SEMUA JADWAL UNTUK PROFIL PENGGUNA ##
// =======================================================
app.get("/attendances/my-schedules", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Query ini menggabungkan tabel jadwal dan kehadiran untuk mendapatkan semua
    // jadwal yang terhubung dengan pengguna yang sedang login.
    const query = `
      SELECT 
        s.id,
        s.title,
        s.description,
        s.schedule_time,
        a.status
      FROM schedules s
      LEFT JOIN attendances a ON s.id = a.schedule_id AND a.user_id = ?
      ORDER BY s.schedule_time DESC
    `;

    const [schedules] = await db.execute(query, [userId]);
    res.json(schedules);
  } catch (error) {
    console.error("Get my schedules error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.listen(PORT, () => {
  console.log(`Attendance service is running on http://localhost:${PORT}`);
});
