import { injectable } from "inversify";
import { knex } from "..";
import { GpsPoint } from "../domain/gps-point/gps-point";
import { IGpsPointRepository } from "../domain/gps-point/igps-point-repository";
import { activity, gpsPoint } from "./table-names";

@injectable()
export class GpsPointRepository implements IGpsPointRepository {
    public async getGpsPointsByActivityId(userId: string, activityId: number): Promise<GpsPoint[]> {
        const gpsPoints = await knex(activity)
            .join(gpsPoint, `${activity}.id`, '=', `${gpsPoint}.activity_id`)
            .where(`${activity}.id`, activityId)
            .where(`${activity}.user_id`, userId)
            .orderBy(`${gpsPoint}.date`);
        return gpsPoints;
    }
}