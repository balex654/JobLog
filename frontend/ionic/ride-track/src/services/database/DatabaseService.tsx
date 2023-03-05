import { sqlite } from "../../App";
import { Activity } from "../../model/sqlite/Activity";
import { GpsPoint } from "../../model/sqlite/GpsPoint";

export class DatabaseService {
    private db: any;

    constructor() {
        this.initConnection();
    }

    private async initConnection() {
        this.db = await sqlite.retrieveConnection("ride-track-db");
    }

    public async AddActivity(activity: Activity): Promise<Activity> {
        const s = activity.startDate;
        const e = activity.endDate;
        const cmd = `INSERT INTO activity (moving_time,name,start_date,end_date) 
            VALUES (
                ${activity.movingTime}, 
                '${activity.name}', 
                '${s.getFullYear()}-${s.getMonth() + 1}-${s.getDate()} ${s.getHours()}:${s.getMinutes()}:${s.getSeconds()}', 
                '${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()} ${e.getHours()}:${e.getMinutes()}:${e.getSeconds()}');`
        const insertResponse = await this.db.run(cmd);
        const id = insertResponse.changes.lastId;
        activity.id = id;
        return activity;
    }

    public async EditActivity(activity: Activity): Promise<Activity> {
        const n = activity.name;
        const m = activity.movingTime;
        const s = activity.startDate;
        const e = activity.endDate;
        const cmd = `UPDATE activity SET 
            name = '${n}',
            moving_time = ${m},
            start_date = '${s.getFullYear()}-${s.getMonth() + 1}-${s.getDate()} ${s.getHours()}:${s.getMinutes()}:${s.getSeconds()}',
            end_date = '${e.getFullYear()}-${e.getMonth() + 1}-${e.getDate()} ${e.getHours()}:${e.getMinutes()}:${e.getSeconds()}'
            WHERE id = ${activity.id!}`;
        await this.db.run(cmd);
        return activity;
    }

    public async AddGpsPoint(gpsPoint: GpsPoint): Promise<GpsPoint> {
        const d = gpsPoint.date;
        const cmd = `INSERT INTO gps_point (activity_id,altitude,latitude,longitude,speed,date)
            VALUES (
                ${gpsPoint.activityId},
                ${gpsPoint.altitude},
                ${gpsPoint.latitude},
                ${gpsPoint.longitude},
                ${gpsPoint.speed},
                '${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}'
            )`;
        const insertResponse = await this.db.run(cmd);
        const id = insertResponse.changes.lastId;
        gpsPoint.id = id;
        return gpsPoint;
    }

    public async TestDelete() {
        await this.db.run("DELETE FROM activity;")
    }

    public async TestGetData(): Promise<GpsPoint[]> {
        const query = `SELECT * FROM gps_point`;
        const response = await this.db.query(query);
        const points: GpsPoint[] = response.values.map((v: any) => {
            return {
                id: v.id,
                latitude: v.latitude,
                longitude: v.longitude,
                altitude: v.altitude
            };
        });
        return points;
    }

    public async TestGetActivities(): Promise<Activity[]> {
        const query = `SELECT * FROM activity`;
        const response = await this.db.query(query);
        const activities: Activity[] = response.values.map((v: any) => {
            return {
                id: v.id
            };
        });
        return activities;
    }
}