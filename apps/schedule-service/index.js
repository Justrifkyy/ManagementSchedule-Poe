require("dotenv").config();
const express = require("express");
const cors = require("cors");
const amqp = require("amqplib");
const db = require("./config/db");
const authenticateToken = require("./middleware/authenticateToken");
const checkAdmin = require("./middleware/checkAdmin");

const app = express();
const PORT = process.env.PORT || 3002;

// ## MIDDLEWARE ##
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// ## ROUTES ##

// Endpoint dasar untuk cek status service
app.get("/", (req, res) => {
  res.json({ message: "Schedule Service is active!" });
});

// Endpoint untuk MEMBUAT jadwal baru (HANYA ADMIN)
app.post("/schedules", authenticateToken, checkAdmin, async (req, res) => {
  try {
    const { title, description, schedule_time } = req.body;
    const userId = req.user.id;

    if (!title || !schedule_time) {
      return res.status(400).json({ message: "Title and schedule_time are required." });
    }

    const query = "INSERT INTO schedules (title, description, schedule_time, created_by) VALUES (?, ?, ?, ?)";
    const [result] = await db.execute(query, [title, description, schedule_time, userId]);
    const newScheduleId = result.insertId;

    // Kirim pesan ke RabbitMQ setelah jadwal berhasil disimpan
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);
      const channel = await connection.createChannel();
      const queue = "schedule_notifications";
      await channel.assertQueue(queue, { durable: true });

      const message = {
        scheduleId: newScheduleId,
        title: title,
        scheduleTime: schedule_time,
        createdBy: userId,
      };

      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
      console.log(`[x] Sent message for new schedule: ${title}`);

      setTimeout(() => {
        connection.close();
      }, 500);
    } catch (amqpError) {
      console.error("Failed to send message to RabbitMQ:", amqpError);
    }

    res.status(201).json({ message: "Schedule created successfully!" });
  } catch (error) {
    console.error("Create schedule error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint untuk MENGAMBIL jadwal (logika disesuaikan per peran)
app.get("/schedules", authenticateToken, async (req, res) => {
  try {
    const { id: userId, role } = req.user;
    let query;
    let params = [];

    if (role === "ADMIN") {
      // Admin hanya melihat jadwal yang mereka buat
      query = "SELECT id, title, description, schedule_time FROM schedules WHERE created_by = ? ORDER BY schedule_time DESC";
      params.push(userId);
    } else {
      // Organizer & Participant melihat semua jadwal
      query = "SELECT id, title, description, schedule_time FROM schedules ORDER BY schedule_time DESC";
    }

    const [schedules] = await db.execute(query, params);
    res.json(schedules);
  } catch (error) {
    console.error("Get schedules error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint untuk MENGAMBIL SATU jadwal (bisa diakses semua role)
app.get("/schedules/:id", authenticateToken, async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const query = "SELECT id, title, description, schedule_time FROM schedules WHERE id = ?";
    const [schedules] = await db.execute(query, [scheduleId]);

    if (schedules.length === 0) {
      return res.status(404).json({ message: "Schedule not found." });
    }
    res.json(schedules[0]);
  } catch (error) {
    console.error("Get single schedule error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint untuk MENGUPDATE jadwal (HANYA ADMIN)
app.put("/schedules/:id", authenticateToken, checkAdmin, async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const userId = req.user.id;
    const { title, description, schedule_time } = req.body;

    if (!title || !schedule_time) {
      return res.status(400).json({ message: "Title and schedule_time are required." });
    }

    // Admin hanya bisa mengedit jadwal yang mereka buat
    const query = "UPDATE schedules SET title = ?, description = ?, schedule_time = ? WHERE id = ? AND created_by = ?";
    const [result] = await db.execute(query, [title, description, schedule_time, scheduleId, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Schedule not found or you do not have permission to edit it.",
      });
    }
    res.json({ message: "Schedule updated successfully." });
  } catch (error) {
    console.error("Update schedule error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Endpoint untuk MENGHAPUS jadwal (HANYA ADMIN)
app.delete("/schedules/:id", authenticateToken, checkAdmin, async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const userId = req.user.id;

    // Admin hanya bisa menghapus jadwal yang mereka buat
    const query = "DELETE FROM schedules WHERE id = ? AND created_by = ?";
    const [result] = await db.execute(query, [scheduleId, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Schedule not found or you do not have permission to delete it.",
      });
    }
    res.json({ message: "Schedule deleted successfully." });
  } catch (error) {
    console.error("Delete schedule error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// ## SERVER START ##
app.listen(PORT, () => {
  console.log(`Schedule service is running on http://localhost:${PORT}`);
});
