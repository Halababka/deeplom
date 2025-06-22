@echo off
REM Скрипт запуска всех сервисов вручную (Windows)

start cmd /k "cd admin-backend && npm run dev"
start cmd /k "cd admin-web && npm run dev"
start cmd /k "cd dental-site && npm run dev"

echo Все сервисы запущены в отдельных окнах.
pause 