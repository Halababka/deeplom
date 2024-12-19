import { Request, Response } from 'express';
import prisma from "../db";

export class SelfController {
    async myself(req: Request, res: Response) {
        const user_id = req.user.id;
        let user = await prisma.user.findFirst({where: {id: user_id}})
        res.json(user);
    }
}