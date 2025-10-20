// services/emailService.js
const nodemailer = require("nodemailer");

// 1. Konfigurasi transporter untuk menggunakan Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2. Fungsi untuk mengirim email notifikasi
const sendScheduleNotification = async (scheduleData) => {
  // Untuk tujuan tes, kita akan kirim email ke alamat pengirim itu sendiri.
  // Nantinya, ini bisa diisi dengan daftar email peserta.
  const recipientEmail = process.env.EMAIL_USER;

  const mailOptions = {
    from: `"Aplikasi Jadwal" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: `Jadwal Baru Dibuat: ${scheduleData.title}`,
    html: `
      <h1>Jadwal Baru Telah Dibuat!</h1>
      <p>Halo,</p>
      <p>Sebuah jadwal baru dengan judul <strong>${scheduleData.title}</strong> telah ditambahkan.</p>
      <p>Jadwal akan dilaksanakan pada: <strong>${new Date(scheduleData.scheduleTime).toLocaleString("id-ID")}</strong></p>
      <p>Terima kasih!</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendScheduleNotification };
