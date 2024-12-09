export interface Branch {
    id: number;
    name: string;
}

export interface Doctor {
    id: number;
    name: string;
    specialty?: string;
}

export interface Interval {
    branchId: number;
    doctorId: number;
    startDateTime: string;
    lengthInMinutes: number;
    isBusy: boolean;
}

export interface TimeTablePayload {
    branches: Branch[];
    doctors: Doctor[];
    intervals: Interval[];
}
