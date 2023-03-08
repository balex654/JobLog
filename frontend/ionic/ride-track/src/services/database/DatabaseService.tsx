import { sqlite } from "../../App";
import { ConvertSQLiteDateToObject } from "../../common/Util";
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
        const cmd = `INSERT INTO activity (user_id,moving_time,name,start_date,end_date) 
            VALUES (
                '${activity.userId}',
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

    public async DeleteActivity(activityId: number): Promise<void> {
        const cmd = `DELETE FROM activity WHERE id = ${activityId}`;
        await this.db.run(cmd);
    }

    public async GetActivitiesForUser(userId: string): Promise<Activity[]> {
        const query = `SELECT * FROM activity WHERE user_id = '${userId}' AND moving_time != -1`;
        const response = await this.db.query(query);
        const activities: Activity[] = response.values.map((v: any) => {
            return {
                id: v.id,
                userId: v.user_id,
                movingTime: v.moving_time,
                name: v.name,
                startDate: new Date(ConvertSQLiteDateToObject(v.start_date)),
                endDate: new Date(ConvertSQLiteDateToObject(v.end_date))
            };
        });
        return activities;
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

    public async GetGpsPointsForActivity(activityId: number): Promise<GpsPoint[]> {
        const query = `SELECT * FROM gps_point WHERE activity_id = ${activityId} ORDER BY date ASC`;
        const response = await this.db.query(query);
        const gpsPoints: GpsPoint[] = response.values.map((v: any) => {
            return {
                id: v.id,
                activityId: v.activity_id,
                altitude: v.altitude,
                latitude: v.latitude,
                longitude: v.longitude,
                speed: v.speed,
                date: v.date
            };
        });
        return gpsPoints;
    }
}