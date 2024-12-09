import { prisma } from "../db";
import { GetTicketsParams } from "../types/requests";

export const getTickets = async ({ dateTimeFrom, dateTimeTo, limit, offset }: GetTicketsParams) => {
    return prisma.request.findMany({
        where: {
            dateAndTime: {
                gte: new Date(dateTimeFrom),
                lte: new Date(dateTimeTo),
            },
        },
        skip: offset,
        take: limit,
    });
};
