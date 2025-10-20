// services/whatsappService.js
const axios = require("axios");

const sendWhatsAppNotification = async (recipientNumber, scheduleData) => {
  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
  const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID;
  const API_URL = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`;

  const messageData = {
    messaging_product: "whatsapp",
    to: recipientNumber,
    type: "template",
    template: { name: "hello_world", language: { code: "en_US" } },
  };

  try {
    // Simpan respons dari axios
    const response = await axios.post(API_URL, messageData, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    // Catat data respons yang sebenarnya
    console.log("WhatsApp API Response:", response.data);
    console.log("Pesan WhatsApp berhasil dikirim!");
  } catch (error) {
    // Jika ada error, catat detail error dari respons API
    console.error("Error sending WhatsApp message:", error.response ? error.response.data.error : error.message);
  }
};

module.exports = { sendWhatsAppNotification };
