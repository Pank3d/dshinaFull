# DshinaFull - Полное решение для продажи шин

Проект состоит из фронтенда на Next.js и Telegram бота для уведомлений о заказах.

## Структура проекта

```
dshinaFull/
├── dshina-back/           # Backend NestJS приложение
├── dshinaFront/           # Frontend Next.js приложение
├── telegram-bot/          # Telegram бот для уведомлений
├── docker-compose.yml     # Конфигурация Docker Compose
├── nginx.conf            # Конфигурация Nginx
├── deploy.sh            # Скрипт деплоя
└── README.md           # Этот файл
```

## Быстрый старт

### 1. Настройка переменных окружения

```bash
# Скопируйте файл с примером
cp .env.example .env

# Отредактируйте .env файл
nano .env
```

Заполните обязательные переменные:
- `BOT_TOKEN` - токен вашего Telegram бота (получить у @BotFather)
- `CHAT_ID` - ID чата для уведомлений (получить у @userinfobot)

### 2. Запуск проекта

#### Вариант 1: Автоматический деплой (рекомендуется)
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Вариант 2: Ручной запуск
```bash
docker-compose up --build -d
```

### 3. Проверка работы

После запуска будут доступны:
- **Backend API**: http://localhost:4000
- **Фронтенд**: http://localhost:3000
- **Telegram Bot API**: http://localhost:3001
- **Nginx** (если используется): http://localhost:80

## Компоненты

### Backend (NestJS)
- SOAP API для получения данных о шинах
- REST API endpoints
- Интеграция с внешними сервисами
- CORS настройки для фронтенда

### Frontend (Next.js)
- Каталог шин с фильтрами
- Корзина товаров
- Детальные страницы товаров
- Форма заказа с валидацией
- Интеграция с Telegram ботом
- Zustand state management

### Telegram Bot
- Получение уведомлений о новых заказах
- API для отправки сообщений
- Health check endpoint
- Обработка контактных форм

### Nginx (опционально)
- Reverse proxy для всех сервисов
- Rate limiting
- SSL терминация
- API routing

## API Endpoints

### Telegram Bot API

```bash
# Отправка заказа
POST http://localhost:3001/api/send-order
{
  "customerName": "Имя клиента",
  "phone": "+7999999999",
  "telegram": "@username",
  "items": [...],
  "totalPrice": 10000
}

# Отправка сообщения с контактной формы
POST http://localhost:3001/api/send-contact
{
  "name": "Имя",
  "email": "email@example.com",
  "phone": "+7999999999",
  "message": "Сообщение"
}

# Health check
GET http://localhost:3001/health
```

## Управление контейнерами

```bash
# Просмотр статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f

# Перезапуск сервиса
docker-compose restart frontend

# Остановка
docker-compose down

# Полная очистка (удаление томов)
docker-compose down -v
```

## Production деплой

### 1. Настройка домена
Обновите nginx.conf для вашего домена:
```nginx
server_name your-domain.com;
```

### 2. SSL сертификаты
```bash
# Создайте директорию для SSL
mkdir ssl

# Поместите сертификаты в ssl/
cp your-cert.pem ssl/cert.pem
cp your-key.pem ssl/key.pem
```

### 3. Production переменные
```bash
# Обновите .env файл
NEXT_PUBLIC_BASE_URL=https://your-api-domain.com
```

### 4. Запуск
```bash
./deploy.sh
```

## Мониторинг

### Логи
```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f frontend
docker-compose logs -f telegram-bot
```

### Метрики
```bash
# Использование ресурсов
docker stats

# Дисковое пространство
docker system df
```

## Решение проблем

### Проблемы с запуском
1. Проверьте переменные окружения в `.env`
2. Убедитесь что порты свободны
3. Проверьте логи: `docker-compose logs`

### Проблемы с Telegram ботом
1. Проверьте BOT_TOKEN у @BotFather
2. Проверьте CHAT_ID у @userinfobot
3. Убедитесь что бот добавлен в чат

### Проблемы с изображениями
Домены для изображений уже настроены в `next.config.ts`:
- api-b2b.pwrs.ru
- **.4tochki.ru

## Разработка

### Локальная разработка
```bash
# Frontend
cd dshinaFront
npm install
npm run dev

# Telegram Bot
cd telegram-bot
npm install
npm start
```

### Сборка образов
```bash
# Только сборка без запуска
docker-compose build

# Принудительная пересборка
docker-compose build --no-cache
```