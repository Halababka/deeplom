"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicketsController = void 0;
const request_service_1 = require("../services/request.service");
const getTicketsController = async (req, res) => {
    const { dateTimeFrom, dateTimeTo, limit = 500, offset = 0 } = req.query;
    try {
        const tickets = await (0, request_service_1.getTickets)({
            dateTimeFrom: dateTimeFrom,
            dateTimeTo: dateTimeTo,
            limit: Number(limit),
            offset: Number(offset),
        });
        res.status(200).json(tickets);
    }
    catch (error) {
        res.status(500).send("Error fetching tickets: " + error.message);
    }
};
exports.getTicketsController = getTicketsController;
