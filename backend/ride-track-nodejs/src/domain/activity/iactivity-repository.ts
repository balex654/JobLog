import { GpsPoint } from "../gps-point/gps-point";
import { Activity } from "./activity";

export interface IActivityRepository {
    addActivity(activity: Activity, gpsPoints: GpsPoint[]): Promise<undefined>;
    getActivities(userId: string): Promise<Activity[]>;
    getActivityById(userId: string, activityId: number): Promise<Activity>;
}