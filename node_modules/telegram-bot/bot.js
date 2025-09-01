const { Telegraf } = require("telegraf");
require("dotenv").config();

class TelegramBot {
  constructor() {
    this.bot = new Telegraf(process.env.BOT_TOKEN);
    this.chatId = process.env.CHAT_ID;
    this.init();
  }

  init() {
    // Команда старт
    this.bot.start((ctx) => {
      ctx.reply("Бот для уведомлений с сайта запущен!");
    });

    // Команда получения chat_id
    this.bot.command("chatid", (ctx) => {
      ctx.reply(`Ваш chat_id: ${ctx.chat.id}`);
    });

    // Обработка ошибок
    this.bot.catch((err, ctx) => {
      console.error("Ошибка бота:", err);
    });

    // Запуск бота
    this.bot.launch();
  }

  // Отправка сообщения о новом заказе
  async sendOrderNotification(orderData) {
    try {
      const contactInfo = [];
      if (orderData.phone) contactInfo.push(`📱 Телефон: ${orderData.phone}`);
      if (orderData.telegram)
        contactInfo.push(`💬 Telegram: ${orderData.telegram}`);
      if (orderData.email) contactInfo.push(`📧 Email: ${orderData.email}`);

      const message = `
🆕 Новый заказ!

👤 Клиент: ${orderData.customerName || "Не указано"}
${contactInfo.join("\n")}

🛍️ Товары:
${orderData.items
  .map(
    (item) =>
      `• ${item.name}\n  Код: ${item.code}\n кол-во:${item.quantity}  Цена: ${item.price}₽\n`
  )
  .join("\n")}

💰 Общая стоимость: ${orderData.totalPrice}₽
⏱️ Время заказа: ${new Date().toLocaleString("ru-RU")}
            `;

      await this.bot.telegram.sendMessage(this.chatId, message);
      return { success: true, message: "Уведомление отправлено" };
    } catch (error) {
      console.error("Ошибка отправки уведомления:", error);
      return { success: false, error: error.message };
    }
  }

  // Отправка сообщения с контактной формы
  async sendContactMessage(contactData) {
    try {
      const message = `
📧 Новое сообщение с сайта!

👤 Имя: ${contactData.name || "Не указано"}
📧 Email: ${contactData.email || "Не указано"}
📱 Телефон: ${contactData.phone || "Не указано"}

💬 Сообщение:
${contactData.message}

⏱️ Время: ${new Date().toLocaleString("ru-RU")}
            `;

      await this.bot.telegram.sendMessage(this.chatId, message);
      return { success: true, message: "Сообщение отправлено" };
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
      return { success: false, error: error.message };
    }
  }

  // Отправка произвольного сообщения
  async sendCustomMessage(text) {
    try {
      await this.bot.telegram.sendMessage(this.chatId, text);
      return { success: true, message: "Сообщение отправлено" };
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
      return { success: false, error: error.message };
    }
  }

  stop() {
    this.bot.stop("SIGINT");
  }
}

module.exports = TelegramBot;
