import prisma from "../db";

export class DoctorService {
    async getAllDoctors() {
        return prisma.doctor.findMany();
    }

    async getDoctorById(id: number) {
        return prisma.doctor.findUnique({ where: { id } });
    }

    async createDoctor(data: { name: string; specialty: string }) {
        return prisma.doctor.create({ data });
    }

    async updateDoctor(id: number, data: { name?: string; specialty?: string }) {
        return prisma.doctor.update({ where: { id }, data });
    }

    async deleteDoctor(id: number) {
        return prisma.doctor.delete({ where: { id } });
    }
}
