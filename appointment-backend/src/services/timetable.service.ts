import { prisma } from "../db";
import { TimeTablePayload } from "../types/timetable";

export const saveTimeTable = async ({ branches, doctors, intervals }: TimeTablePayload) => {
    for (const branch of branches) {
        await prisma.iDENT_Branches.upsert({
            where: { id: branch.id },
            update: { name: branch.name },
            create: { id: branch.id, name: branch.name },
        });
    }
    for (const doctor of doctors) {
        await prisma.iDENT_Doctors.upsert({
            where: { id: doctor.id },
            update: { name: doctor.name, specialty: doctor.specialty },
            create: { id: doctor.id, name: doctor.name, specialty: doctor.specialty },
        });
    }
    for (const interval of intervals) {
        await prisma.iDENT_Intervals.upsert({
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
