import { knex } from ".."
import { User } from "../domain/user/user"
import { injectable } from "inversify";
import { IUserRepository } from "../domain/user/iuser-repository";
import { BikeStats, LongestRide, Stats, TopSpeed } from "../domain/user/stats/stats";
import { Activity } from "../domain/activity/activity";
import { GpsPoint } from "../domain/gps-point/gps-point";
import { GetHorizontalDistance, GetPowerForTwoPoints } from "../common/calculations";
import { activity, bike, gpsPoint, user } from "./table-names";

@injectable()
export class UserRepository implements IUserRepository {
    public async getUserById(id: string): Promise<User> {
        return await knex(user)
                .where('id', id)
                .first();
    }

    public async getUserByEmail(email: string): Promise<User> {
        return await knex(user)
                .where('email', email)
                .first();
    }

    public async addUser(user: User): Promise<User> {
        await knex(user)
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
        await knex(user)
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
        const distanceYTD = await this.getTotalDistanceYear(user);
        const distanceMonth = await this.getTotalDistanceMonth(user);
        const bikeStats = await this.getAllBikeStats(user);
        return new Stats(
            longestRide, 
            topSpeed,
            distanceYTD,
            distanceMonth,
            bikeStats);
    }

    private async getLongestRide(user: User): Promise<LongestRide | undefined> {
        const activities = await knex(activity)
                            .where({user_id: user.id}) as any[];
        if (activities.length === 0) {
            return undefined;
        }

        let longestDistance = 0;
        let longestActivity: Activity;
        let i = 0;
        for (i = 0; i < activities.length; i++) {
            const gpsPoints = await knex(gpsPoint)
                                .where({activity_id: parseInt(activities[i].id!)})
                                .orderBy('date') as GpsPoint[];
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
        const result = await knex(gpsPoint)
            .join(activity, `${gpsPoint}.activity_id`, '=', `${activity}.id`)
            .where(`${activity}.user_id`, user.id)
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

    private async getTotalDistanceYear(user: User): Promise<number> {
        const start = new Date();
        start.setMonth(0);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        return await this.getDistanceInDateRange(user, start, end);
    }

    private async getTotalDistanceMonth(user: User): Promise<number> {
        const start = new Date();
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        return await this.getDistanceInDateRange(user, start, end);
    }

    private async getDistanceInDateRange(user: User, start: Date, end: Date): Promise<number> {
        const activities = await knex(activity)
                            .where({user_id: user.id})
                            .where('start_date', '>', start.toISOString())
                            .where('start_date', '<', end.toISOString());
        let distance = 0;
        let i = 0;
        for (i = 0; i < activities.length; i++) {
            const gpsPoints = await knex(gpsPoint)
                                .where({activity_id: parseInt(activities[i].id!)})
                                .orderBy('date') as GpsPoint[];
            let j = 0;
            for (j = 0; j < gpsPoints.length - 2; j++) {
                const cur = gpsPoints[j];
                const next = gpsPoints[j + 1];
                distance += GetHorizontalDistance(cur, next);
            }   
        }

        return distance;
    }

    private async getAllBikeStats(user: User): Promise<BikeStats[]> {
        const activities = await knex(activity)
                        .join(bike, `${activity}.bike_id`, '=', `${bike}.id`)
                        .select(
                            `${activity}.id`, 
                            `${activity}.bike_id`, 
                            `${activity}.total_mass`, 
                            `${bike}.name`,
                            `${activity}.user_id`)
                        .where(`${activity}.user_id`, user.id) as any[];
        const bikeStats = new Map<number, BikeStats>();
        activities.forEach(a => {
            a.id = parseInt(a.id);
            a.bike_id = parseInt(a.bike_id);
            bikeStats.set(a.bike_id, {
                bike_name: a.name,
                total_distance: 0,
                average_speed: 0,
                average_power: 0
            });
        });

        let i = 0;
        for (i = 0; i < activities.length; i++) {
            const a = activities[i];
            const gpsPoints = await knex(gpsPoint)
                                .where({activity_id: parseInt(a.id!)})
                                .orderBy('date') as GpsPoint[];
            const activityBikeStats = this.getBikeStatsForActivity(a.name, a.total_mass, gpsPoints);
            const currentStats = bikeStats.get(a.bike_id)!;
            if (currentStats.average_power === 0 && currentStats.average_speed === 0) {
                bikeStats.set(a.bike_id, {
                    bike_name: a.name,
                    total_distance: activityBikeStats.total_distance,
                    average_power: activityBikeStats.average_power,
                    average_speed: activityBikeStats.average_speed
                });
            }
            else {
                bikeStats.set(a.bike_id, {
                    bike_name: a.name,
                    total_distance: currentStats.total_distance + activityBikeStats.total_distance,
                    average_power: (currentStats.average_power + activityBikeStats.average_power) / 2,
                    average_speed: (currentStats.average_speed + activityBikeStats.average_speed) / 2
                });
            }
        }

        const bikeStatsArr: BikeStats[] = [];
        for (let item of bikeStats) {
            bikeStatsArr.push(item[1]);
        }
        return bikeStatsArr;
    }

    private getBikeStatsForActivity(bikeName: string, totalMass: number, gpsPoints: GpsPoint[]): BikeStats {
        const bikeStats: BikeStats = {
            bike_name: bikeName,
            total_distance: 0,
            average_speed: 0,
            average_power: 0,
        };
        let i = 0;
        for (i = 0; i < gpsPoints.length - 2; i++) {
            const cur = gpsPoints[i];
            const next = gpsPoints[i + 1];
            bikeStats.average_speed += cur.speed;
            bikeStats.total_distance += GetHorizontalDistance(cur, next);
            const power = GetPowerForTwoPoints(cur, next, totalMass);
            if (power > 0) {
                bikeStats.average_power += power;
            }
        }

        bikeStats.average_power = bikeStats.average_power / gpsPoints.length;
        bikeStats.average_speed = bikeStats.average_speed / gpsPoints.length;
        return bikeStats;
    }
}