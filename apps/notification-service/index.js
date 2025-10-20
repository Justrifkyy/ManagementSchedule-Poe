require("dotenv").config();
const amqp = require("amqplib");

// Import kedua service notifikasi
const { sendScheduleNotification } = require("./services/emailService");
const { sendWhatsAppNotification } = require("./services/whatsappService");

const RABBITMQ_URL = process.env.RBITMQ_URL;

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
        console.log(`[x] Received message: ${messageContent}`);

        const scheduleData = JSON.parse(messageContent);

        // Nomor tujuan untuk tes WhatsApp (hardcode)
        // PENTING: Ganti dengan nomor WhatsApp Anda yang sudah terverifikasi di Meta
        const recipientPhoneNumber = "6289518804219"; // Ganti jika perlu

        console.log("--> Sending email notification...");
        await sendScheduleNotification(scheduleData);

        console.log("--> Sending WhatsApp notification...");
        await sendWhatsAppNotification(recipientPhoneNumber, scheduleData);

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
