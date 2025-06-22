# Инструкция по установке системы на чистую ОС

## Быстрая установка через скрипты

- **Windows:**
  1. Откройте PowerShell или CMD **от имени администратора**.
  2. Выполните:
     ```
     install-windows.bat
     ```
  3. Скрипт автоматически установит все зависимости и запустит docker-compose.

- **Linux (Debian/Ubuntu):**
  1. Откройте терминал.
  2. Сделайте скрипт исполняемым (только при первом запуске):
     ```bash
     chmod +x install-linux.sh
     ```
  3. Запустите скрипт:
     ```bash
     ./install-linux.sh
     ```
  4. Скрипт автоматически установит все зависимости и запустит docker-compose.

---

## 1. Установка необходимых инструментов

### Node.js и npm
- **Windows**:
  1. Скачайте установщик с официального сайта: https://nodejs.org/
  2. Запустите установщик и следуйте инструкциям.
- **Linux (Ubuntu/Debian)**:
  ```bash
  sudo apt update
  sudo apt install -y nodejs npm
  # или для последних версий:
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

### Yarn (опционально, если используется)
- **Windows**:
  ```powershell
  npm install --global yarn
  ```
- **Linux**:
  ```bash
  npm install --global yarn
  ```

### Docker и Docker Compose
- **Windows**:
  1. Скачайте Docker Desktop: https://www.docker.com/products/docker-desktop
  2. Установите и перезагрузите компьютер при необходимости.
- **Linux (Ubuntu/Debian)**:
  ```bash
  sudo apt update
  sudo apt install -y docker.io docker-compose
  sudo systemctl enable --now docker
  sudo usermod -aG docker $USER
  # Перезайдите в систему или выполните: newgrp docker
  ```

## 2. Клонирование репозитория проекта
Если проект находится в архиве или уже распокован, то пропустите этот шаг.
```bash
git clone <URL-ВАШЕГО-РЕПОЗИТОРИЯ>
cd <ПАПКА-ПРОЕКТА>
```

## 3. Установка зависимостей

### Backend (admin-backend)
```bash
cd admin-backend
npm install # или yarn install
```

### Frontend (admin-web и dental-site)
```bash
cd ../admin-web
npm install # или yarn install
cd ../dental-site
npm install # или yarn install
```

## 4. Настройка переменных окружения

Создайте файлы `.env` в папках `admin-backend`, `admin-web`, `dental-site` по примеру `.env.example` (если есть)

## 5. Миграции и инициализация базы данных

### Через Docker Compose (рекомендуется)
```bash
docker-compose up -d
```

### Ручной запуск миграций (если не используется Docker)
```bash
cd admin-backend
npx prisma migrate deploy
npx prisma db seed
```

## 6. Запуск приложений

### Вариант 1: через Docker Compose (рекомендуется)
Если вы запускали команду:
```bash
docker-compose up -d
```
то все сервисы (backend, admin-web, dental-site, база данных) стартуют автоматически, и отдельный запуск приложений не требуется.

- Проверить статус контейнеров можно командой:
  ```bash
  docker-compose ps
  ```
- Остановить все сервисы:
  ```bash
  docker-compose down
  ```

### Вариант 2: вручную (без Docker)
Если вы не используете Docker Compose, запустите приложения по отдельности:

#### Backend
```bash
cd admin-backend
npm run dev # или yarn dev
```

#### Frontend (админка)
```bash
cd admin-web
npm run dev # или yarn dev
```

#### Frontend (сайт)
```bash
cd dental-site
npm run dev # или yarn dev
```

## 7. Доступ к приложениям
- Backend API: http://localhost:3001 (или порт из .env)
- Admin Web: http://localhost:3000
- Dental Site: http://localhost:3002

---

**Примечания:**
- Для Windows все команды npm/yarn выполняются в PowerShell или CMD.
- Для Linux — в терминале Bash.
- Если возникают ошибки с правами доступа к Docker, убедитесь, что пользователь добавлен в группу docker.
- Для работы с Docker Desktop на Windows может потребоваться включить WSL2. 