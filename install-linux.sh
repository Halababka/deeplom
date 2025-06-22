#!/bin/bash
# Скрипт установки проекта для Linux (Debian/Ubuntu)

set -e

# Проверка наличия Node.js
if ! command -v node &> /dev/null; then
  echo "Node.js не установлен! Установите Node.js: https://nodejs.org/"
  exit 1
fi

# Проверка наличия npm
if ! command -v npm &> /dev/null; then
  echo "npm не установлен! Установите npm: https://nodejs.org/"
  exit 1
fi

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
  echo "Docker не установлен! Установите Docker: https://docs.docker.com/engine/install/"
  exit 1
fi

# Проверка наличия docker-compose
if ! command -v docker-compose &> /dev/null; then
  echo "docker-compose не установлен! Установите docker-compose: https://docs.docker.com/compose/install/"
  exit 1
fi

# Установка зависимостей backend
cd admin-backend
npm install
cd ..

# Установка зависимостей admin-web
cd admin-web
npm install
cd ..

# Установка зависимостей dental-site
cd dental-site
npm install
cd ..

# Запуск docker-compose
sudo docker-compose up -d

echo "=== Установка завершена! ==="
echo "Для запуска вручную смотрите скрипты run-*.sh" 