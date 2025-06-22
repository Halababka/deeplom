@echo off
REM Переход в папку, где лежит этот скрипт
cd /d %~dp0
REM Скрипт установки проекта для Windows (требует прав администратора)

REM Проверка запуска от имени администратора
openfiles >nul 2>&1
if %errorlevel% neq 0 (
  echo Требуются права администратора. Перезапуск...
  powershell -Command "Start-Process '%~f0' -Verb RunAs"
  exit /b
)

REM Проверка наличия Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo Node.js не установлен! Пожалуйста, установите Node.js с https://nodejs.org/
  exit /b 1
)

REM Проверка наличия Docker
where docker >nul 2>nul
if %errorlevel% neq 0 (
  echo Docker не установлен! Пожалуйста, установите Docker Desktop с https://www.docker.com/products/docker-desktop
  exit /b 1
)

REM Установка зависимостей backend
cd admin-backend
call npm install
cd ..

REM Установка зависимостей admin-web
cd admin-web
call npm install
cd ..

REM Установка зависимостей dental-site
cd dental-site
call npm install
cd ..

REM Запуск docker-compose
call docker-compose up -d

echo === Установка завершена! ===
echo Для запуска вручную смотрите скрипты run-*. 
pause 