import { injectable } from "inversify";
import { knex } from "..";
import { GpsPoint } from "../domain/gps-point/gps-point";
import { IGpsPointRepository } from "../domain/gps-point/igps-point-repository";

@injectable()
export class GpsPointRepository implements IGpsPointRepository {
    public async getGpsPointsByActivityId(userId: string, activityId: number): Promise<GpsPoint[]> {
        const gpsPoints = await knex('ride_track_app_activity')
            .join('ride_track_app_gpspoint', 'ride_track_app_activity.id', '=', 'ride_track_app_gpspoint.activity_id')
            .where({'ride_track_app_activity.id': activityId, 'ride_track_app_activity.user_id': userId})
            .orderBy('ride_track_app_gpspoint.date');
        return gpsPoints;
    }
}