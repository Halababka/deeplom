"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTimeTableController = void 0;
const timetable_service_1 = require("../services/timetable.service");
const postTimeTableController = async (req, res) => {
    const { branches, doctors, intervals } = req.body;
    try {
        await (0, timetable_service_1.saveTimeTable)({ branches, doctors, intervals });
        res.status(200).send("TimeTable uploaded successfully");
    }
    catch (error) {
        res.status(500).send("Error uploading timetable: " + error.message);
    }
};
exports.postTimeTableController = postTimeTableController;
