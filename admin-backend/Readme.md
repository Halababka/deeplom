# Сервис Dental (Backend)
___

### Описание
Создан для обработки эндпоинтов и обращений к БД

___
## Структура

* app.ts - инициализация приложения
* db.ts - prisma клиент
* server.ts - запуск сервера

___
## Скрипты
* dev. Запуск сервера в режиме разработки
    ```bash
        nodemon --exec 'node --env-file=.env' src/server.ts
    ```

* build. Компиляция TypeScript в JavaScript
    ```bash
        tsc
    ```

* start. Запуск компилированного кода
    ```bash
        node --env-file=.env dist/server.js
    ```

* prisma:migrate. Запуск миграций
    ```bash
        npx prisma migrate dev
    ```

* prisma:generate. Генерация клиента Prisma
    ```bash
        npx prisma generate
    ```
