import prisma from "../db";

export class DoctorService {
    async getAllDoctors() {
        return prisma.doctor.findMany({include: {avatar: true, photos: true, certificates: true}});
    }

    async getDoctorById(id: number) {
        return prisma.doctor.findUnique({where: {id}, include: {avatar: true, photos: true, certificates: true}});
    }

    async createDoctor(data: {
        name: string;
        specialty: string;
        experience?: number;
        avatarId?: number;
        education?: string;
        courses?: string;
        photoIds?: number[];
        certificateIds?: number[];
    }) {
        const {name, specialty, experience, education, courses, avatarId, photoIds, certificateIds} = data;

        return prisma.doctor.create({
            data: {
                name,
                specialty,
                education,
                courses,
                experience,
                avatar: avatarId ? {connect: {id: avatarId}} : undefined,
                photos: photoIds ? {connect: photoIds.map(id => ({id}))} : undefined,
                certificates: certificateIds ? {connect: certificateIds.map(id => ({id}))} : undefined
            },
            include: {
                avatar: true,
                photos: true,
                certificates: true
            }
        });
    }


    async updateDoctor(id: number, data: {
        name?: string;
        experience?: number;
        specialty?: string;
        education?: string;
        courses?: string;
        avatarId?: number | null;
        photoIds?: number[] | null;
        certificateIds?: number[] | null;
    }) {
        const {name, experience,avatarId, education, courses, specialty, photoIds, certificateIds} = data;

        return prisma.doctor.update({
            where: {id},
            data: {
                name,
                specialty,
                education,
                courses,
                experience,
                avatar: avatarId === null
                    ? {disconnect: true}
                    : avatarId
                        ? {connect: {id: avatarId}}
                        : undefined,
                photos: photoIds === null
                    ? {set: []}
                    : photoIds
                        ? {set: photoIds.map(id => ({id}))}
                        : undefined,
                certificates: certificateIds === null
                    ? {set: []}
                    : certificateIds
                        ? {set: certificateIds.map(id => ({id}))}
                        : undefined
            },
            include: {
                avatar: true,
                photos: true,
                certificates: true
            }
        });
    }


    async deleteDoctor(id: number) {
        return prisma.doctor.delete({where: {id}});
    }

    async deleteDoctors(ids: number[]) {
        return prisma.doctor.deleteMany({
            where: {
                id: {
                    in: ids, // Указываем массив идентификаторов для удаления
                },
            },
        });
    }

}
