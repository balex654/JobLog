import { injectable } from "inversify";
import { knex } from "..";
import { Activity } from "../domain/activity/activity";
import { IActivityRepository } from "../domain/activity/iactivity-repository";
import { GpsPoint } from "../domain/gps-point/gps-point";

@injectable()
export class ActivityRepository implements IActivityRepository {
    public async addActivity(activity: Activity, gpsPoints: GpsPoint[]): Promise<undefined> {
        const activityId = await knex('ride_track_app_activity')
                .insert({
                    name: activity.name,
                    start_date: activity.start_date,
                    end_date: activity.end_date,
                    moving_time: activity.moving_time,
                    total_mass: activity.total_mass,
                    bike_id: activity.bike_id,
                    user_id: activity.user_id
                }, ['id']);
        await knex('ride_track_app_gpspoint')
                .insert(gpsPoints.map(g => {
                        return {
                            date: g.date,
                            speed: g.speed,
                            latitude: g.latitude,
                            longitude: g.longitude,
                            altitude: g.altitude,
                            activity_id: parseInt(activityId[0].id)
                        };
                    })
                );
        return undefined;
    }
}