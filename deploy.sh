#!/bin/bash

# Deploy script для проекта DshinaFull

set -e

echo "🚀 Начинаем деплой проекта DshinaFull..."

# Проверка наличия .env файла
if [ ! -f .env ]; then
    echo "❌ Файл .env не найден!"
    echo "📝 Скопируйте .env.example в .env и заполните необходимые переменные:"
    echo "   cp .env.example .env"
    exit 1
fi

# Загрузка переменных окружения
source .env

# Проверка обязательных переменных
if [ -z "$BOT_TOKEN" ] || [ -z "$CHAT_ID" ]; then
    echo "❌ Не заполнены обязательные переменные BOT_TOKEN и CHAT_ID в .env файле"
    exit 1
fi

echo "✅ Переменные окружения проверены"

# Остановка и удаление существующих контейнеров
echo "🛑 Остановка существующих контейнеров..."
docker-compose down

# Удаление старых образов (опционально)
# echo "🗑️ Удаление старых образов..."
# docker system prune -f

# Сборка и запуск контейнеров
echo "🏗️ Сборка и запуск контейнеров..."
docker-compose up --build -d

# Ожидание запуска сервисов
echo "⏳ Ожидание запуска сервисов..."
sleep 30

# Проверка статуса контейнеров
echo "📊 Проверка статуса контейнеров..."
docker-compose ps

# Проверка логов
echo "📋 Последние логи сервисов:"
docker-compose logs --tail=20

# Проверка доступности сервисов
echo "🔍 Проверка доступности сервисов..."

# Проверка бэкенда
if curl -f http://localhost:4000 > /dev/null 2>&1; then
    echo "✅ Бэкенд доступен на http://localhost:4000"
else
    echo "❌ Бэкенд недоступен"
fi

# Проверка фронтенда
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Фронтенд доступен на http://localhost:3000"
else
    echo "❌ Фронтенд недоступен"
fi

# Проверка Telegram бота
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Telegram бот доступен на http://localhost:3001"
else
    echo "❌ Telegram бот недоступен"
fi

# Проверка Nginx (если используется)
if curl -f http://localhost:80 > /dev/null 2>&1; then
    echo "✅ Nginx доступен на http://localhost:80"
else
    echo "⚠️ Nginx недоступен (это нормально если не используется)"
fi

echo ""
echo "🎉 Деплой завершен!"
echo ""
echo "📍 Доступные сервисы:"
echo "   Бэкенд API: http://localhost:4000"
echo "   Фронтенд: http://localhost:3000"
echo "   Telegram Bot: http://localhost:3001"
echo "   Nginx (если используется): http://localhost:80"
echo ""
echo "📊 Для мониторинга используйте:"
echo "   docker-compose logs -f                 # Все логи"
echo "   docker-compose logs -f backend         # Логи бэкенда"
echo "   docker-compose logs -f frontend        # Логи фронтенда"
echo "   docker-compose logs -f telegram-bot    # Логи Telegram бота"
echo ""
echo "🛑 Для остановки используйте:"
echo "   docker-compose down"