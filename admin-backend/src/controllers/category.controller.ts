import {Request, Response} from "express";
import {CategoryService} from "../services/category.service";

const categoryService = new CategoryService();

export class CategoryController {
    async getAllCategories(req: Request, res: Response) {
        try {
            const categories = await categoryService.getAllCategories();
            res.json(categories);
        } catch (error) {
            res.status(500).json({error: "Failed to fetch categories."});
        }
    }

    async getCategoryById(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const category = await categoryService.getCategoryById(Number(id));

            if (!category) {
                res.status(404).json({error: "Category not found."});
                return
            }

            res.json(category);
        } catch (error) {
            res.status(500).json({error: "Failed to fetch category."});
        }
    }

    async createCategory(req: Request, res: Response) {
        try {
            const {name, parentId, only, services, doctorIds} = req.body;
            const category = await categoryService.createCategory({
                name,
                parentId,
                only,
                services,
                doctorIds
            });
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({error: "Failed to create category."});
        }
    }

    async updateCategory(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const {services, doctorIds, ...data} = req.body;

            const category = await categoryService.updateCategory(Number(id), data, services, doctorIds);

            if (!category) {
                res.status(404).json({error: "Category not found."});
                return;
            }

            res.json(category);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: "Failed to update category."});
        }
    }


    async deleteCategory(req: Request, res: Response) {
        try {
            const {id} = req.params;

            await categoryService.deleteCategory(Number(id));

            res.status(204).send();
        } catch (error) {
            res.status(500).json({error: "Failed to delete category."});
        }
    }

    async deleteCategories(req: Request, res: Response) {
        const {ids} = req.body; // Ожидаем массив идентификаторов в теле запроса

        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).json({error: 'Invalid input: ids should be a non-empty array.'});
            return
        }

        try {
            const result = await categoryService.deleteCategories(ids);
            res.status(200).json({message: 'Categories deleted successfully', result});
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Failed to delete categories'});
        }
    }
}
