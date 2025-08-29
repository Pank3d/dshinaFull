# 🚀 Полный деплой всего проекта на сервер 212.8.227.80

## Что будет развернуто:

✅ **Backend** (NestJS) - порт 4000  
✅ **Frontend** (Next.js) - порт 3000  
✅ **Telegram Bot** - порт 3001  
✅ **Nginx** (reverse proxy) - порт 80  
✅ **Docker** + **Docker Compose** для управления контейнерами

## 📋 Пошаговая инструкция:

### 1️⃣ Настроить GitHub Secrets

В GitHub репозитории перейдите в **Settings** → **Secrets and variables** → **Actions** и добавьте:

**Обязательный секрет:**
- `SERVER_PASSWORD` = `SDO9c2I!X8Qj`

**Опциональные секреты для Telegram бота:**
- `TELEGRAM_BOT_TOKEN` = ваш токен бота (получить у @BotFather)
- `TELEGRAM_CHAT_ID` = ID чата для уведомлений

### 2️⃣ Запустить деплой

**Вариант А:** Автоматически при push
```bash
git add .
git commit -m "Deploy full stack application"
git push origin main
```

**Вариант Б:** Вручную через GitHub Actions
1. Откройте **Actions** в репозитории
2. Выберите **Deploy Full Stack Application**
3. Нажмите **Run workflow**

### 3️⃣ Дождаться завершения

Процесс займет **10-15 минут**. CI/CD автоматически:
- Установит Docker и Docker Compose на сервер
- Клонирует весь проект
- Соберет все Docker контейнеры
- Запустит все сервисы

### 4️⃣ Проверить результат

После завершения все сервисы будут доступны:

- 🌐 **Frontend:** http://212.8.227.80:3000
- 🔧 **Backend API:** http://212.8.227.80:4000
- 🤖 **Telegram Bot:** http://212.8.227.80:3001
- 🔗 **Nginx Proxy:** http://212.8.227.80

## 🔧 Управление после деплоя

### Подключение к серверу:
```bash
ssh root@212.8.227.80
cd /var/www/dshina
```

### Полезные команды:
```bash
# Просмотр статуса всех сервисов
docker-compose ps

# Просмотр логов
docker-compose logs backend
docker-compose logs frontend
docker-compose logs telegram-bot

# Рестарт сервисов
docker-compose restart

# Обновление проекта
git pull
docker-compose build --no-cache
docker-compose up -d

# Остановка всех сервисов
docker-compose down
```

## 📊 Мониторинг

### Проверка работоспособности:
- Backend health: http://212.8.227.80:4000/
- Telegram bot health: http://212.8.227.80:3001/health
- Frontend: http://212.8.227.80:3000

### Логи в реальном времени:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f telegram-bot
```

## 🆘 Решение проблем

### Если контейнеры не запускаются:
```bash
docker-compose down
docker system prune -f
docker-compose build --no-cache
docker-compose up -d
```

### Если нет места на диске:
```bash
docker system prune -a
docker volume prune
```

### Если порты заняты:
```bash
netstat -tulpn | grep :3000
kill -9 <PID>
```

---

## ⚡ Готово к запуску!

1. Добавьте секрет `SERVER_PASSWORD`
2. Запушьте код
3. Дождитесь завершения CI/CD
4. Проверьте работу сервисов

Весь стек будет работать на **одном сервере** через **Docker контейнеры**!