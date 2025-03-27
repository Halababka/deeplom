import {Request, Response} from 'express';
import {ServiceService} from '../services/service.service';

const serviceService = new ServiceService();

export class ServiceController {
    async getAllServices(req: Request, res: Response): Promise<void> {
        try {
            const services = await serviceService.getAllServices();
            res.json(services);
        } catch (error) {
            res.status(500).json({error: 'Internal server error'});
        }
    }

    async getServiceById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const service = await serviceService.getServiceById(id);
            if (service) {
                res.json(service);
            } else {
                res.status(404).json({error: 'Service not found'});
            }
        } catch (error) {
            res.status(500).json({error: 'Internal server error'});
        }
    }

    async createService(req: Request, res: Response): Promise<void> {
        try {
            const {name, price, categoryId, popular} = req.body
            const service = await serviceService.createService({name, price, categoryId, popular});
            res.status(201).json(service);
        } catch (error) {
            res.status(500).json({error: 'Internal server error'});
        }
    }

    async updateService(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            const service = await serviceService.updateService(id, req.body);
            res.json(service);
        } catch (error) {
            res.status(500).json({error: 'Internal server error'});
        }
    }

    async deleteService(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id);
            await serviceService.deleteService(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({error: 'Internal server error'});
        }
    }

    async deleteServices(req: Request, res: Response) {
        const {ids} = req.body; // Ожидаем массив идентификаторов в теле запроса

        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({error: 'Invalid input: ids should be a non-empty array.'});
            return
        }

        try {
            const result = await serviceService.deleteServices(ids);
            res.status(200).json({message: 'Categories deleted successfully', result});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Failed to delete categories'});
        }
    }

}