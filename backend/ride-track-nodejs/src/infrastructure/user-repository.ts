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
        let topSpeed: TopSpeed;
        return new Stats(
            longestRide, 
            topSpeed!,
            0,
            0,
            []);
    }

    private async getLongestRide(user: User): Promise<LongestRide> {
        const activities = await knex('ride_track_app_activity')
                            .where({user_id: user.id}) as any[];
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

        return {
            activity: longestActivity!,
            distance: longestDistance
        };
    }
}