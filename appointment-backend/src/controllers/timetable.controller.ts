import { Request, Response } from "express";
import { saveTimeTable } from "../services/timetable.service";
import { TimeTablePayload } from "../types/timetable";

export const postTimeTableController = async (req: Request, res: Response) => {
    const { branches, doctors, intervals }: TimeTablePayload = req.body;

    try {
        await saveTimeTable({ branches, doctors, intervals });
        res.status(200).send("TimeTable uploaded successfully");
    } catch (error: any) {
        res.status(500).send("Error uploading timetable: " + error.message);
    }
};
