#!/bin/bash
# Скрипт запуска всех сервисов вручную (Linux)

# Проверка наличия gnome-terminal для запуска в отдельных окнах
if command -v gnome-terminal &> /dev/null; then
  gnome-terminal -- bash -c "cd admin-backend && npm run dev"
  gnome-terminal -- bash -c "cd admin-web && npm run dev"
  gnome-terminal -- bash -c "cd dental-site && npm run dev"
  echo "Все сервисы запущены в отдельных окнах терминала."
else
  echo "gnome-terminal не найден. Запустите сервисы вручную в отдельных окнах или вкладках терминала:" 
  echo "cd admin-backend && npm run dev"
  echo "cd admin-web && npm run dev"
  echo "cd dental-site && npm run dev"
fi 