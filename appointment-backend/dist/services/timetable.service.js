"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveTimeTable = void 0;
const db_1 = require("../db");
const saveTimeTable = async ({ branches, doctors, intervals }) => {
    for (const branch of branches) {
        await db_1.prisma.iDENT_Branches.upsert({
            where: { id: branch.id },
            update: { name: branch.name },
            create: { id: branch.id, name: branch.name },
        });
    }
    for (const doctor of doctors) {
        await db_1.prisma.iDENT_Doctors.upsert({
            where: { id: doctor.id },
            update: { name: doctor.name, specialty: doctor.specialty },
            create: { id: doctor.id, name: doctor.name, specialty: doctor.specialty },
        });
    }
    for (const interval of intervals) {
        await db_1.prisma.iDENT_Intervals.upsert({
            where: {
                branchId_doctorId_startDateTime: {
                    branchId: interval.branchId,
                    doctorId: interval.doctorId,
                    startDateTime: new Date(interval.startDateTime),
                },
            },
            update: { lengthInMinutes: interval.lengthInMinutes, isBusy: interval.isBusy },
            create: {
                branchId: interval.branchId,
                doctorId: interval.doctorId,
                startDateTime: new Date(interval.startDateTime),
                lengthInMinutes: interval.lengthInMinutes,
                isBusy: interval.isBusy,
            },
        });
    }
};
exports.saveTimeTable = saveTimeTable;
