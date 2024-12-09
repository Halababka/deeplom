"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTickets = void 0;
const db_1 = require("../db");
const getTickets = async ({ dateTimeFrom, dateTimeTo, limit, offset }) => {
    return db_1.prisma.request.findMany({
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
exports.getTickets = getTickets;
