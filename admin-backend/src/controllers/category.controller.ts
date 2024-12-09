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
            const {name, parentId, only} = req.body;
            const category = await categoryService.createCategory({name, parentId, only});
            res.status(201).json(category);
        } catch (error) {
            res.status(500).json({error: "Failed to create category."});
        }
    }

    async updateCategory(req: Request, res: Response) {
        try {
            const {id} = req.params;
            const data = req.body;

            const category = await categoryService.updateCategory(Number(id), data);

            if (!category) {
                res.status(404).json({error: "Category not found."});
                return
            }

            res.json(category);
        } catch (error) {
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
}
