import { Request, Response } from 'express';
import { CompanyService } from '../services/company.service';

const companyService = new CompanyService();

export class CompanyController {
    async getAll(req: Request, res: Response) {
        try {
            const companies = await companyService.getCompanies();
            // Десериализация JSON-строк
            const formattedCompanies = companies.map(company => ({
                ...company,
                services: JSON.parse(company.services),
                socialLinks: JSON.parse(company.socialLinks),
                fullDescription: JSON.parse(company.fullDescription),
            }));
            res.status(200).json(formattedCompanies);
        } catch (error) {
            res.status(500).json({ error: 'Не удалось получить список компаний' });
        }
    }

    async getById(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Некорректный ID' });
            return;
        }

        try {
            const company = await companyService.getCompanyById(id);
            if (!company) {
                res.status(404).json({ error: 'Компания не найдена' });
                return;
            }
            // Десериализация JSON-строк
            const formattedCompany = {
                ...company,
                services: JSON.parse(company.services),
                socialLinks: JSON.parse(company.socialLinks),
                fullDescription: JSON.parse(company.fullDescription),
            };
            res.status(200).json(formattedCompany);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка получения компании' });
        }
    }

    async create(req: Request, res: Response) {
        const data = req.body;

        // Сериализация JSON-полей
        data.services = JSON.stringify(data.services);
        data.socialLinks = JSON.stringify(data.socialLinks);
        data.fullDescription = JSON.stringify(data.fullDescription);

        try {
            const company = await companyService.createCompany(data);
            res.status(201).json(company);
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: 'Ошибка создания компании' });
        }
    }

    async update(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Некорректный ID' });
            return;
        }

        const data = req.body;

        // Сериализация JSON-полей
        if (data.services) data.services = JSON.stringify(data.services);
        if (data.socialLinks) data.socialLinks = JSON.stringify(data.socialLinks);
        if (data.fullDescription) data.fullDescription = JSON.stringify(data.fullDescription);

        try {
            const company = await companyService.updateCompany(id, data);
            res.status(200).json(company);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка обновления компании' });
        }
    }

    async delete(req: Request, res: Response) {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ error: 'Некорректный ID' });
            return;
        }

        try {
            await companyService.deleteCompany(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Ошибка удаления компании' });
        }
    }

    async deleteMany(req: Request, res: Response) {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.some((id) => isNaN(Number(id)))) {
            res.status(400).json({ error: 'Некорректный массив идентификаторов' });
            return;
        }

        try {
            const result = await companyService.deleteCompanies(ids);
            res.status(200).json({
                message: `${result.count} компании(й) успешно удалены`,
            });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при удалении компаний' });
        }
    }
}
