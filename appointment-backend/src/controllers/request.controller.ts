import { Request, Response } from "express";
import { getTickets } from "../services/request.service";

export const getTicketsController = async (req: Request, res: Response) => {
    const { dateTimeFrom, dateTimeTo, limit = 500, offset = 0 } = req.query;

    try {
        const tickets = await getTickets({
            dateTimeFrom: dateTimeFrom as string,
            dateTimeTo: dateTimeTo as string,
            limit: Number(limit),
            offset: Number(offset),
        });
        res.status(200).json(tickets);
    } catch (error: any) {
        res.status(500).send("Error fetching tickets: " + error.message);
    }
};
