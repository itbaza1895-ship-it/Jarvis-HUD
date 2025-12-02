# 🚀 Руководство по развертыванию JARVIS HUD

Подробные инструкции по деплою проекта на различных платформах.

## 📋 Содержание

- [GitHub Pages](#github-pages)
- [Vercel](#vercel)
- [Netlify](#netlify)
- [OnSpace](#onspace)
- [Собственный VPS/VDS](#собственный-vpsvds)
- [Docker](#docker)

---

## GitHub Pages

### Автоматический деплой (рекомендуется)

1. **Включите GitHub Pages в настройках репозитория:**
   - Settings → Pages
   - Source: GitHub Actions

2. **Workflow уже настроен** в `.github/workflows/deploy.yml`

3. **Push в main/master ветку:**
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

4. **Проверьте деплой:**
   - Actions → Deploy to GitHub Pages
   - Ваш сайт: `https://ваш-username.github.io/jarvis-hud/`

### Ручной деплой

```bash
# Сборка проекта
npm run build

# Установка gh-pages
npm install -D gh-pages

# Деплой
npx gh-pages -d dist
```

### Важные настройки

Если репозиторий не в корне домена, обновите `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/jarvis-hud/', // имя вашего репозитория
  // ... остальные настройки
});
```

---

## Vercel

### Через Vercel CLI

```bash
# Установка Vercel CLI
npm i -g vercel

# Логин
vercel login

# Деплой
vercel

# Production деплой
vercel --prod
```

### Через веб-интерфейс

1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "New Project"
3. Импортируйте репозиторий с GitHub
4. Vercel автоматически определит настройки для Vite
5. Нажмите "Deploy"

### Конфигурация (опционально)

Создайте `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite"
}
```

---

## Netlify

### Через Netlify CLI

```bash
# Установка Netlify CLI
npm install -g netlify-cli

# Логин
netlify login

# Инициализация
netlify init

# Деплой
netlify deploy

# Production деплой
netlify deploy --prod
```

### Через веб-интерфейс

1. Зайдите на [netlify.com](https://netlify.com)
2. "Add new site" → "Import an existing project"
3. Выберите ваш GitHub репозиторий
4. Настройки сборки:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. "Deploy site"

### Конфигурация

Создайте `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "20"
```

---

## OnSpace

Проект уже оптимизирован для OnSpace.

### Publish to OnSpace.app subdomain

1. **В OnSpace редакторе:**
   - Нажмите кнопку "Publish" (правая верхняя панель)
   - Выберите "Publish (Default)"
   - Получите URL вида `https://ваш-проект.onspace.app`

2. **Автоматически настроено:**
   - HTTPS сертификат
   - CDN
   - Автоматические обновления при коммите

### Кастомный домен

1. **В OnSpace редакторе:**
   - Publish → "Add Existing Domain"
   - Введите ваш домен (например: `jarvis.yourdomain.com`)

2. **Настройте DNS:**
   - Добавьте CNAME запись у вашего DNS провайдера:
   ```
   jarvis.yourdomain.com → ваш-проект.onspace.app
   ```

3. **Подтвердите** в OnSpace интерфейсе

---

## Собственный VPS/VDS

### Требования

- Node.js 18+
- Nginx или Apache
- PM2 (для production)

### 1. Подключитесь к серверу

```bash
ssh user@your-server-ip
```

### 2. Установите зависимости

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2
sudo npm install -g pm2

# Nginx
sudo apt-get install -y nginx
```

### 3. Клонируйте проект

```bash
cd /var/www
sudo git clone https://github.com/ваш-username/jarvis-hud.git
cd jarvis-hud
sudo npm install
sudo npm run build
```

### 4. Настройте Nginx

```bash
sudo nano /etc/nginx/sites-available/jarvis-hud
```

Добавьте конфигурацию:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/jarvis-hud/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Кеширование статики
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

Активируйте конфигурацию:

```bash
sudo ln -s /etc/nginx/sites-available/jarvis-hud /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL сертификат (Let's Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 6. Автообновление (опционально)

```bash
# Создайте скрипт обновления
sudo nano /var/www/jarvis-hud/update.sh
```

```bash
#!/bin/bash
cd /var/www/jarvis-hud
git pull
npm install
npm run build
sudo systemctl restart nginx
```

```bash
# Сделайте исполняемым
sudo chmod +x /var/www/jarvis-hud/update.sh

# Добавьте в crontab (обновление каждый день в 3:00)
sudo crontab -e
# Добавьте строку:
0 3 * * * /var/www/jarvis-hud/update.sh >> /var/log/jarvis-update.log 2>&1
```

---

## Docker

### Dockerfile

Создайте `Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

Создайте `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

### docker-compose.yml

Создайте `docker-compose.yml`:

```yaml
version: '3.8'

services:
  jarvis-hud:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
    container_name: jarvis-hud
```

### Команды

```bash
# Сборка и запуск
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка
docker-compose down

# Пересборка
docker-compose up -d --build
```

---

## 🔒 Безопасность камеры

**ВАЖНО:** Для доступа к камере требуется HTTPS (кроме localhost).

### Решения:

1. **Localhost** - работает без HTTPS
2. **GitHub Pages** - автоматический HTTPS
3. **Vercel/Netlify** - автоматический HTTPS
4. **Собственный сервер** - используйте Let's Encrypt (бесплатно)

---

## 📊 Мониторинг

### Google Analytics (опционально)

Добавьте в `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🆘 Проблемы при деплое

### Build fails

```bash
# Очистите кеш
rm -rf node_modules dist
npm install
npm run build
```

### Camera not working in production

- Убедитесь что используется HTTPS
- Проверьте разрешения браузера
- Проверьте Mixed Content (HTTP ресурсы на HTTPS странице)

### High loading time

- Включите gzip сжатие
- Используйте CDN
- Оптимизируйте изображения
- Включите кеширование

---

## 📞 Поддержка

Если возникли проблемы:
- 🐛 [Создайте Issue](https://github.com/ваш-username/jarvis-hud/issues)
- 📧 Email: your-email@example.com
