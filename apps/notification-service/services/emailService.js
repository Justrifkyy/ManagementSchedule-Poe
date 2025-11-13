const nodemailer = require("nodemailer");

// 1. Konfigurasi transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 2. Fungsi untuk mengirim email notifikasi (sudah dimodifikasi)
const sendScheduleNotification = async (recipientEmail, scheduleData) => {
  // Fungsi ini sekarang menerima 'recipientEmail' sebagai parameter

  const mailOptions = {
    from: `"Aplikasi Jadwal" <${process.env.EMAIL_USER}>`,
    to: recipientEmail, // Menggunakan email target
    subject: `Anda Diundang: ${scheduleData.title}`, // Subjek baru untuk undangan
    html: `
      <h1>Anda Diundang ke Event Baru!</h1>
      <p>Halo,</p>
      <p>Anda telah diundang untuk berpartisipasi dalam event: <strong>${scheduleData.title}</strong>.</p>
      <p>Jadwal akan dilaksanakan pada: <strong>${new Date(scheduleData.scheduleTime).toLocaleString("id-ID")}</strong></p>
      <p>Silakan login ke aplikasi untuk mengonfirmasi kehadiran Anda.</p>
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
