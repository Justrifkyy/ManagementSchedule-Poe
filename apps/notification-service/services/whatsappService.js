const axios = require("axios");

const sendWhatsAppNotification = async (recipientNumber, scheduleData) => {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
  const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
  const API_URL = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`;

  // Logika baru: Menggunakan template kustom dengan parameter dinamis
  // Ganti 'schedule_notification' dengan nama template Anda yang sudah disetujui di Meta
  // Ganti 'id' dengan kode bahasa template Anda (misal: 'en_US')
  const messageData = {
    messaging_product: "whatsapp",
    to: recipientNumber,
    type: "template",
    template: {
      name: "schedule_notification", // Ganti dengan nama template Anda
      language: {
        code: "id", // Ganti dengan kode bahasa Anda
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: scheduleData.title, // Ini akan mengisi {{1}}
            },
            {
              type: "text",
              text: new Date(scheduleData.scheduleTime).toLocaleString("id-ID"), // Ini akan mengisi {{2}}
            },
          ],
        },
      ],
    },
  };

  try {
    const response = await axios.post(API_URL, messageData, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    console.log("WhatsApp API Response:", response.data);
    console.log("Pesan WhatsApp berhasil dikirim!");
  } catch (error) {
    console.error("Error sending WhatsApp message:", error.response ? error.response.data.error : error.message);
  }
};

module.exports = { sendWhatsAppNotification };
