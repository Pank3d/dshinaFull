const express = require('express');
const cors = require('cors');
const TelegramBot = require('./bot');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Инициализация бота
const bot = new TelegramBot();

// API Routes
app.post('/api/send-order', async (req, res) => {
    try {
        const result = await bot.sendOrderNotification(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/send-contact', async (req, res) => {
    try {
        const result = await bot.sendContactMessage(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/send-message', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ success: false, error: 'Сообщение обязательно' });
        }
        const result = await bot.sendCustomMessage(message);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Обработка завершения приложения
process.once('SIGINT', () => {
    bot.stop();
    process.exit(0);
});

process.once('SIGTERM', () => {
    bot.stop();
    process.exit(0);
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});