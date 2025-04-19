const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const csvFilePath = path.resolve(__dirname, 'E:/Dental/src/files/price2.csv');

async function parseAndSeedDatabase() {
    const categories = [];
    const services = [];
    let lastCategory1 = null;
    let lastCategory2 = null;

    await new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csvParser({ headers: ['id', 'name', 'price'], separator: ',' }))
            .on('data', (row) => {
                const id = parseInt(row.id, 10);
                const name = row.name.trim();
                const price = row.price ? parseInt(row.price.replace(/\s/g, ''), 10) : null;

                if (id === 1) {
                    // Категория 1 уровня
                    lastCategory1 = { name, children: [] };
                    categories.push(lastCategory1);
                    lastCategory2 = null;
                } else if (id === 2) {
                    // Категория 2 уровня
                    lastCategory2 = { name, only: !lastCategory1, services: [] };
                    if (lastCategory1) {
                        lastCategory1.children.push(lastCategory2);
                    } else {
                        categories.push(lastCategory2);
                    }
                } else if (id === 3) {
                    // Услуга
                    const service = { name, price };
                    if (lastCategory2) {
                        lastCategory2.services.push(service);
                    } else if (lastCategory1) {
                        lastCategory1.services = lastCategory1.services || [];
                        lastCategory1.services.push(service);
                    }
                }
            })
            .on('end', resolve)
            .on('error', reject);
    });

    // Устанавливаем популярность для услуг
    for (let i = 0; i < 6; i++) {
        for (const category of categories) {
            if (category.services && category.services[0]) {
                category.services[0].popular = true
            }
        }
    }

    console.log('Parsing complete. Seeding database...');

    // Функция для рекурсивного создания категорий и услуг
    async function createCategoryWithChildren(category, parentId = null) {
        const createdCategory = await prisma.category.create({
            data: {
                name: category.name,
                only: category.only || false,
                parent: parentId ? { connect: { id: parentId } } : undefined,
                services: {
                    create: category.services || []
                }
            }
        });

        if (category.children) {
            for (const child of category.children) {
                await createCategoryWithChildren(child, createdCategory.id);
            }
        }
    }

    // Создание категорий и услуг
    for (const category of categories) {
        await createCategoryWithChildren(category);
    }

    console.log('Database seeded successfully.');
    await prisma.$disconnect();
}

parseAndSeedDatabase().catch((error) => {
    console.error('Error seeding database:', error);
    prisma.$disconnect();
});