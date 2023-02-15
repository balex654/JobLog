import { GpsPoint } from "./gps-point";

export interface IGpsPointRepository {
    getGpsPointsByActivityId(userId: string, activityId: number): Promise<GpsPoint[]>;
}