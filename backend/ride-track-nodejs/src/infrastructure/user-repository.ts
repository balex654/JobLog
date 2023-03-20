import { knex } from ".."
import { User } from "../domain/user/user"
import { injectable } from "inversify";
import { IUserRepository } from "../domain/user/iuser-repository";
import { LongestRide, Stats, TopSpeed } from "../domain/user/stats/stats";
import { Activity } from "../domain/activity/activity";
import { GpsPoint } from "../domain/gps-point/gps-point";
import { GetHorizontalDistance } from "../common/calculations";

@injectable()
export class UserRepository implements IUserRepository {
    public async getUserById(id: string): Promise<User> {
        return await knex('ride_track_app_user')
                .where('id', id)
                .first();
    }

    public async getUserByEmail(email: string): Promise<User> {
        return await knex('ride_track_app_user')
                .where('email', email)
                .first();
    }

    public async addUser(user: User): Promise<User> {
        await knex('ride_track_app_user')
                .insert({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    weight: user.weight,
                    email: user.email,
                    id: user.id,
                    unit: user.unit
                });
        return user;
    }

    public async editUser(user: User): Promise<User> {
        await knex('ride_track_app_user')
                .where({id: user.id})
                .update({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    weight: user.weight,
                    unit: user.unit
                });
        return user;
    }

    public async getUserStats(user: User): Promise<Stats> {
        const longestRide = await this.getLongestRide(user);
        const topSpeed = await this.getTopSpeed(user);
        return new Stats(
            longestRide, 
            topSpeed,
            0,
            0,
            []);
    }

    private async getLongestRide(user: User): Promise<LongestRide | undefined> {
        const activities = await knex('ride_track_app_activity')
                            .where({user_id: user.id}) as any[];
        if (activities.length === 0) {
            return undefined;
        }
        
        let longestDistance = 0;
        let longestActivity: Activity;
        let i = 0;
        for (i = 0; i < activities.length; i++) {
            const gpsPoints = await knex('ride_track_app_gpspoint')
                                .where({activity_id: parseInt(activities[i].id!)})
                                .orderBy('ride_track_app_gpspoint.date') as GpsPoint[];
            let distance = 0;
            let j = 0;
            for (j = 0; j < gpsPoints.length - 2; j++) {
                const cur = gpsPoints[j];
                const next = gpsPoints[j + 1];
                distance += GetHorizontalDistance(cur, next);
            }

            if (distance > longestDistance) {
                longestDistance = distance;
                longestActivity = activities[i];
            }
        }

        longestActivity!.id = parseInt(longestActivity!.id! as any);
        longestActivity!.bike_id = parseInt(longestActivity!.bike_id as any);        
        return {
            activity: longestActivity!,
            distance: longestDistance
        };
    }

    private async getTopSpeed(user: User): Promise<TopSpeed | undefined> {
        const result = await knex('ride_track_app_gpspoint')
            .join('ride_track_app_activity', 'ride_track_app_gpspoint.activity_id', '=', 'ride_track_app_activity.id')
            .where({'ride_track_app_activity.user_id': user.id})
            .orderBy('speed', 'desc')
            .first();
        if (result === undefined) {
            return undefined;
        }

        return {
            activity: new Activity(
                result.name,
                result.start_date,
                result.end_date,
                result.moving_time,
                parseInt(result.bike_id),
                result.user_id,
                result.total_mass,
                parseInt(result.id)
            ),
            speed: result.speed
        };
    }
}