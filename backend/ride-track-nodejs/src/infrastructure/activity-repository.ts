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

    public async getActivities(userId: string): Promise<Activity[]> {
        const activities = await knex('ride_track_app_activity')
                            .where({user_id: userId})
                            .orderBy('start_date', 'desc') as any[];
        activities.forEach(a => {
            a.id = parseInt(a.id!);
            a.bike_id = parseInt(a.bike_id!);
        })
        return activities;
    }

    public async getActivityById(userId: string, activityId: number): Promise<Activity> {
        const activity = await knex('ride_track_app_activity')
                            .where({id: activityId, user_id: userId})
                            .first();
        if (activity != undefined) {
            activity.id = parseInt(activity.id);
            activity.bike_id = parseInt(activity.bike_id);
        }
        return activity;
    }
}