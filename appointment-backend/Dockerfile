# Используем официальный образ Node.js
FROM node:20-alpine

# Устанавливаем необходимые зависимости для Prisma
RUN apk add --no-cache openssl

# Чтение аргумента PRISMA_BINARY_TARGETS
ARG PRISMA_BINARY_TARGETS

# Установка переменной окружения для Prisma
ENV PRISMA_BINARY_TARGETS=${PRISMA_BINARY_TARGETS}

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./
COPY prisma ./prisma

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы приложения
COPY . .

# Генерируем Prisma клиент
RUN npx prisma db pull
# RUN npx prisma generate

# RUN npx prisma migrate deploy

# Открываем порт
EXPOSE 8090

# Запускаем приложение
CMD ["npm", "run", "dev"]
