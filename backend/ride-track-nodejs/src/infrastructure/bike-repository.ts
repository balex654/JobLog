import { injectable } from "inversify";
import { knex } from "..";
import { Bike } from "../domain/bike/bike";
import { IBikeRepository } from "../domain/bike/ibike-repository";
import { bike as bikeTable } from "./table-names";

@injectable()
export class BikeRepository implements IBikeRepository {
    public async addBike(bike: Bike): Promise<Bike> {
        const idResponse = await knex(bikeTable)
                            .insert({
                                name: bike.name,
                                weight: bike.weight,
                                user_id: bike.user_id,
                                is_deleted: bike.is_deleted
                            }, ['id']);
        bike.id = parseInt(idResponse[0].id);
        return bike;
    }

    public async deleteBike(bikeId: number, userId: string): Promise<undefined> {
        await knex(bikeTable)
                .where({id: bikeId, user_id: userId, is_deleted: false})
                .update({is_deleted: true});
        return undefined;
    }

    public async getBikeById(bikeId: number, userId: string): Promise<Bike> {
        const bike = await knex(bikeTable)
                        .where({id: bikeId, user_id: userId, is_deleted: false})
                        .first();
        if (bike != undefined) {
            bike.id = parseInt(bike.id)
        }
        return bike;
    }

    public async editBike(bike: Bike, userId: string): Promise<Bike> {
        await knex(bikeTable)
                .where({id: bike.id!, user_id: userId, is_deleted: false})
                .update({name: bike.name, weight: bike.weight});
        return bike;
    }

    public async getBikes(userId: string): Promise<Bike[]> {
        const bikes = await knex(bikeTable)
                        .where({user_id: userId, is_deleted: false}) as any[];
        bikes.forEach(b => {
            b.id = parseInt(b.id!)
        });
        return bikes;
    }
}