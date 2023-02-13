import { GpsPoint } from "../gps-point/gps-point";
import { Activity } from "./activity";

export interface IActivityRepository {
    addActivity(activity: Activity, gpsPoints: GpsPoint[]): Promise<undefined>;
}