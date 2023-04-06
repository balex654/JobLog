import { knex } from ".."
import { User } from "../domain/user/user"
import { injectable } from "inversify";
import { IUserRepository } from "../domain/user/iuser-repository";
import { BikeStats, LongestRide, Stats, TopSpeed } from "../domain/user/stats/stats";
import { Activity } from "../domain/activity/activity";
import { activity, gpsPoint, user as userTable } from "./table-names";
import { LongestRideQuery } from "./sql-queries/longest-ride";
import { DistanceYTD } from "./sql-queries/distance-ytd";
import { DistanceMTD } from "./sql-queries/distance-mtd";
import { BikeStatsDistSpeed } from "./sql-queries/bike-stats-dist-speed";
import { BikeStatsPower } from "./sql-queries/bike-stats-power";
import { CreatePowerFunc } from "./sql-queries/create-power-func";

@injectable()
export class UserRepository implements IUserRepository {
    public async getUserById(id: string): Promise<User> {
        return await knex(userTable)
                .where('id', id)
                .first();
    }

    public async getUserByEmail(email: string): Promise<User> {
        return await knex(userTable)
                .where('email', email)
                .first();
    }

    public async addUser(user: User): Promise<User> {
        await knex(userTable)
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
        await knex(userTable)
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
        const distanceYTD = (await knex.raw(DistanceYTD, [user.id])).rows[0].distance_ytd;
        const distanceMonth = (await knex.raw(DistanceMTD, [user.id])).rows[0].distance_mtd;
        const bikeStats = await this.getAllBikeStats(user);
        return new Stats(
            longestRide, 
            topSpeed,
            distanceYTD,
            distanceMonth,
            bikeStats);
    }

    private async getLongestRide(user: User): Promise<LongestRide | undefined> {
        const query = await knex.raw(LongestRideQuery, [user.id]);
        if (query.rows.length !== 0) {
            const result = query.rows[0];
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
                distance: result.total_distance
            };
        }
        else {
            return undefined;
        }
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

    private async getAllBikeStats(user: User): Promise<BikeStats[]> {
        const DistanceAndSpeed = (await knex.raw(BikeStatsDistSpeed, [user.id])).rows;
        await knex.raw(CreatePowerFunc);
        const Power = (await knex.raw(BikeStatsPower, [user.id])).rows;

        const bikeStatsDict = new Map<string, BikeStats>();
        let i = 0;
        for (i = 0; i < DistanceAndSpeed.length; i++) {
            bikeStatsDict.set(DistanceAndSpeed[i].bike_name, {
                bike_name: DistanceAndSpeed[i].bike_name,
                total_distance: DistanceAndSpeed[i].total_distance,
                average_speed: DistanceAndSpeed[i].average_speed,
                average_power: 0
            });
        }
        for (i = 0; i < Power.length; i++) {
            bikeStatsDict.set(Power[i].bike_name, {
                bike_name: bikeStatsDict.get(Power[i].bike_name)!.bike_name,
                total_distance: bikeStatsDict.get(Power[i].bike_name)!.total_distance,
                average_speed: bikeStatsDict.get(Power[i].bike_name)!.average_speed,
                average_power: Power[i].average_power
            });
        }

        const bikeStatsArr: BikeStats[] = [];
        for (let item of bikeStatsDict) {
            bikeStatsArr.push(item[1]);
        }
        return bikeStatsArr;
    }
}