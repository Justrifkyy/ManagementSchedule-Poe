require("dotenv").config();
const amqp = require("amqplib");

// Import kedua service notifikasi
const { sendScheduleNotification } = require("./services/emailService");
const { sendWhatsAppNotification } = require("./services/whatsappService");

// Pastikan nama variabel .env Anda benar (RABBITMQ_URL)
const RABBITMQ_URL = process.env.RABBITMQ_URL;

async function startListener() {
  console.log("Notification service starting...");
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    const queue = "schedule_notifications";
    await channel.assertQueue(queue, { durable: true });

    console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const messageContent = msg.content.toString();
        console.log(`[x] Received targeted message: ${messageContent}`);

        // Logika baru: parsing data notifikasi yang ditargetkan
        const notificationData = JSON.parse(messageContent);

        // Ambil data spesifik dari pesan
        const targetEmail = notificationData.recipientEmail;
        const targetPhone = notificationData.recipientPhone;
        const scheduleDetails = {
          title: notificationData.scheduleTitle,
          scheduleTime: notificationData.scheduleTime,
        };

        // Kirim notifikasi HANYA ke target yang ditentukan
        console.log(`--> Sending email notification to ${targetEmail}...`);
        await sendScheduleNotification(targetEmail, scheduleDetails);

        console.log(`--> Sending WhatsApp notification to ${targetPhone}...`);
        await sendWhatsAppNotification(targetPhone, scheduleDetails);

        channel.ack(msg); // Konfirmasi bahwa pesan sudah diproses
      }
    });
  } catch (error) {
    console.error("Error in notification service:", error);
    // Coba konek lagi setelah beberapa detik
    setTimeout(startListener, 5000);
  }
}

startListener();
