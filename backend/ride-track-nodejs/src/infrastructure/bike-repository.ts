import { injectable } from "inversify";
import { knex } from "..";
import { Bike } from "../domain/bike/bike";
import { IBikeRepository } from "../domain/bike/ibike-repository";

@injectable()
export class BikeRepository implements IBikeRepository {
    public async addBike(bike: Bike): Promise<Bike> {
        const idResponse = await knex('ride_track_app_bike')
                            .insert({
                                name: bike.name,
                                weight: bike.weight,
                                user_id: bike.user_id,
                                is_deleted: bike.is_deleted
                            }, ['id']);
        bike.id = idResponse[0].id;
        return bike;
    }
}