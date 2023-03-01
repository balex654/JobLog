import { sqlite } from "../../App";
import { Activity } from "../../model/sqlite/Activity";
import { GpsPoint } from "../../model/sqlite/GpsPoint";

export class DatabaseService {
    private db: any;

    constructor() {
        this.initConnection();
    }

    private async initConnection() {
        this.db = await sqlite.reretrieveConnection("ride-track-db");
    }

    public async AddActivity(activity: Activity): Promise<Activity> {
        const cmd = `INSERT INTO activity (moving_time,name,start_date,end_date) 
            VALUES (
                ${activity.movingTime}, 
                ${activity.name}, 
                ${activity.startDate}, 
                ${activity.endDate});`
        const insertResponse = await this.db.run(cmd);
        const id = insertResponse.changes.lastId;
        activity.id = id;
        return activity;
    }

    public async AddGpsPoint(gpsPoint: GpsPoint): Promise<GpsPoint> {
        const cmd = `INSERT INTO gps_point (activity_id,altitude,latitude,longitude,speed,date)
            VALUES (
                ${gpsPoint.activityId},
                ${gpsPoint.altitude},
                ${gpsPoint.latitude},
                ${gpsPoint.longitude},
                ${gpsPoint.speed},
                ${gpsPoint.date}
            )`;
        const insertResponse = await this.db.run(cmd);
        const id = insertResponse.changes.lastId;
        gpsPoint.id = id;
        return gpsPoint;
    }
}