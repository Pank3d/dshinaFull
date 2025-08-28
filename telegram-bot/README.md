# Telegram Bot для уведомлений

Telegram бот для отправки уведомлений с сайта DshinaFront.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте бота в Telegram:
   - Напишите @BotFather в Telegram
   - Создайте нового бота командой `/newbot`
   - Получите токен бота

3. Настройте переменные окружения в файле `.env`:
```
BOT_TOKEN=ваш_токен_бота
CHAT_ID=ваш_chat_id
PORT=3001
```

4. Для получения CHAT_ID:
   - Запустите бота
   - Напишите боту `/start`
   - Используйте команду `/chatid` для получения вашего chat_id

## Запуск

```bash
npm start
```

Для разработки с автоперезагрузкой:
```bash
npm run dev
```

## API Endpoints

### POST /api/send-order
Отправка уведомления о новом заказе
```json
{
  "customerName": "Имя клиента",
  "email": "email@example.com",
  "phone": "+7999999999",
  "items": [
    {
      "name": "Название товара",
      "code": "код_товара",
      "price": 1000
    }
  ],
  "totalPrice": 1000
}
```

### POST /api/send-contact
Отправка сообщения с контактной формы
```json
{
  "name": "Имя",
  "email": "email@example.com",
  "phone": "+7999999999",
  "message": "Текст сообщения"
}
```

### POST /api/send-message
Отправка произвольного сообщения
```json
{
  "message": "Текст сообщения"
}
```

### GET /health
Проверка состояния сервера

## Интеграция с сайтом

Для отправки уведомлений с фронтенда используйте fetch:

```javascript
// Отправка заказа
const sendOrderNotification = async (orderData) => {
  try {
    const response = await fetch('http://localhost:3001/api/send-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    const result = await response.json();
    console.log('Уведомление отправлено:', result);
  } catch (error) {
    console.error('Ошибка отправки уведомления:', error);
  }
};
```