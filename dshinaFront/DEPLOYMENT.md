# Настройка CI/CD для деплоя на сервер

## Предварительные требования

### На сервере должно быть установлено:
- Node.js 18+
- PM2 (`npm install -g pm2`)
- Git

## Настройка GitHub Secrets

В репозитории GitHub перейдите в Settings → Secrets and variables → Actions и добавьте следующие секреты:

### Обязательные секреты:
- `SERVER_HOST` - IP адрес или домен вашего сервера
- `SERVER_USER` - пользователь для SSH подключения  
- `SERVER_SSH_KEY` - приватный SSH ключ для подключения к серверу

### Опциональные секреты:
- `SERVER_PORT` - SSH порт (по умолчанию 22)
- `SERVER_PROJECT_PATH` - путь к проекту на сервере (по умолчанию /var/www/dshina)
- `NEXT_PUBLIC_BASE_URL` - базовый URL для API

## Настройка сервера

### 1. Создание пользователя для деплоя (опционально)
```bash
# Создание пользователя
sudo adduser deploy
sudo usermod -aG sudo deploy

# Переключение на пользователя
su - deploy
```

### 2. Настройка SSH ключей
```bash
# На локальной машине генерируем SSH ключ
ssh-keygen -t rsa -b 4096 -C "deploy@yourserver"

# Копируем публичный ключ на сервер
ssh-copy-id deploy@your-server-ip

# Приватный ключ добавляем в GitHub Secrets как SERVER_SSH_KEY
```

### 3. Создание директории проекта
```bash
sudo mkdir -p /var/www/dshina
sudo chown deploy:deploy /var/www/dshina
```

### 4. Создание .env файла на сервере
```bash
# В /var/www/dshina/.env
NEXT_PUBLIC_BASE_URL=http://your-api-server:4000
NODE_ENV=production
PORT=3000
```

### 5. Настройка PM2
```bash
# Установка PM2 глобально
npm install -g pm2

# Настройка автозапуска
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u deploy --hp /home/deploy
```

### 6. Настройка логов
```bash
sudo mkdir -p /var/log/pm2
sudo chown deploy:deploy /var/log/pm2
```

## Настройка Nginx (опционально)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Запуск деплоя

### Автоматический деплой:
- Пушьте код в ветку `main` или `master`
- GitHub Actions автоматически запустит процесс деплоя

### Ручной деплой:
- Перейдите в Actions → Deploy to Server
- Нажмите "Run workflow"

## Мониторинг

### Проверка статуса приложения:
```bash
pm2 status
pm2 logs dshina
pm2 monit
```

### Рестарт приложения:
```bash
pm2 restart dshina
```

### Просмотр логов:
```bash
pm2 logs dshina --lines 100
```

## Откат к предыдущей версии

```bash
cd /var/www/dshina
pm2 stop dshina
rm -rf current
mv backup current
cd current
pm2 start ecosystem.config.js
```

## Использование Docker (альтернативный способ)

### Сборка образа:
```bash
docker build -t dshina .
```

### Запуск контейнера:
```bash
docker run -p 3000:3000 -d --name dshina-app dshina
```

### Docker Compose:
```yaml
version: '3.8'
services:
  dshina:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_BASE_URL=http://your-api:4000
    restart: unless-stopped
```