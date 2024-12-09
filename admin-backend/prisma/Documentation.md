# Инструкция по инициализации и использованию Prisma

___

### Содержание:
[Шаг 1: Установка зависимостей](#Step1)\
[Шаг 2: Настройка подключения к базе данных](#Step2)\
[Шаг 3: Определение моделей](#Step3)\
[Шаг 4: Применение изменений в базе данных](#Step4)\
[Шаг 5: Использование Prisma Client в коде](#Step5)\
[Шаг 6: Обновление схемы](#Step6)
___

<h2 id="Step1">Шаг 1: Установка зависимостей</h2>

1. Установите prisma и @prisma/client в проект:

    ```bash
    npm install prisma @prisma/client
    ```

2. Инициализируйте Prisma в проекте:

    ```bash
    npx prisma init
    ```

После выполнения этой команды будет создана папка prisma с файлом schema.prisma и файл .env для хранения переменных
окружения.
___

<h2 id="Step2">Шаг 2: Настройка подключения к базе данных</h2>

1. Откройте файл .env и настройте переменную DATABASE_URL, указав путь к базе данных SQLite, MySQL или PostgreSQL.\
    
   Для SQLite (файл базы данных находится в корневой папке проекта):
    
    ```
    DATABASE_URL="file:./dev.db"
    ```
    
    Для MySQL:
    
    ```
    DATABASE_URL="mysql://user:password@localhost:3306/mydb"
    ```
    
    Для PostgreSQL:
    
    ```
    DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
    ```

2. В файле prisma/schema.prisma настройте провайдер базы данных и строку подключения:

    Для SQLite:
    
    ```javascript
    datasource
    db
    {
        provider = "sqlite"
        url = env("DATABASE_URL")
    }
    ```
    
    Для MySQL:
    
    ```javascript
    datasource
    db
    {
        provider = "mysql"
        url = env("DATABASE_URL")
    }
    ```
    
    Для PostgreSQL:
    
    ```javascript
    datasource
    db
    {
        provider = "postgresql"
        url = env("DATABASE_URL")
    }
    ```

___

<h2 id="Step3">Шаг 3: Определение моделей</h2>

1. В файле prisma/schema.prisma определите свои модели. Например:

    ```
    model Doctor {
    id        Int     @id @default(autoincrement())
    name      String
    specialty String
    services  Service[]
    }
    
    model Service {
    id          Int     @id @default(autoincrement())
    name        String
    description String?
    doctorId    Int
    doctor      Doctor  @relation(fields: [doctorId], references: [id])
    }
    ```

2. После добавления или изменения моделей в schema.prisma выполните миграцию, чтобы обновить базу данных.

___

<h2 id="Step4">Шаг 4: Применение изменений в базе данных</h2>

1. Сгенерируйте миграцию для обновления базы данных на основе изменений в схеме:

    ```bash
    npx prisma migrate dev --name <имя_миграции>
    ```

    Где <имя_миграции> — это описание миграции, например, init, add-doctor-model и т.д.

    ```bash
    npx prisma migrate dev
    ```

    Эта команда:

   * Создает новую миграцию.
   * Применяет миграцию к базе данных.
   * Генерирует Prisma Client для работы с новой схемой.


2. Если нужно применить миграции на продакшн-среде, используйте команду:

    ```bash
    npx prisma migrate deploy
    ```

3. Чтобы синхронизировать изменения схемы с клиентом (после миграции), выполните команду для генерации Prisma Client:

    ```bash
    npx prisma generate
    ```

___

<h2 id="Step5">Шаг 5: Использование Prisma Client в коде</h2>

1. Импортируйте и используйте Prisma Client в коде:

    ```typescript
    import {PrismaClient} from '@prisma/client';
    
    const prisma = new PrismaClient();
    
    // Пример использования
    async function main() {
        const doctors = await prisma.doctor.findMany();
        console.log(doctors);
    }
    
    main()
        .catch(e => {
            throw e
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
    ```

___

<h2 id="Step6">Шаг 6: Обновление схемы</h2>

1. Если вам нужно обновить схему (например, добавить новые поля или модели), выполните следующие шаги:

* Обновите файл prisma/schema.prisma с новыми моделями или полями.

* Запустите команду миграции:

    ```bash
    npx prisma migrate dev --name <имя_миграции>
    ```
  Или с указанием имени в вводе
     ```bash
    npx prisma migrate dev
    ```

2. Если схема изменена, но вам нужно только обновить клиент:
    ```bash
    npx prisma generate
    ```

3. Для применения миграции на продакшн-среде (если необходимо):
    ```bash
    npx prisma migrate deploy
    ```

___
### Содержание:
[Шаг 1: Установка зависимостей](#Step1)\
[Шаг 2: Настройка подключения к базе данных](#Step2)\
[Шаг 3: Определение моделей](#Step3)\
[Шаг 4: Применение изменений в базе данных](#Step4)\
[Шаг 5: Использование Prisma Client в коде](#Step5)\
[Шаг 6: Обновление схемы](#Step6)
