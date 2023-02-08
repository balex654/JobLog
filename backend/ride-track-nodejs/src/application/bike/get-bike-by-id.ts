import { inject } from "inversify";
import { BikeResponse } from "../../contract/bike/bike-response";
import { IBikeRepository } from "../../domain/bike/ibike-repository";
import { container } from "../../inversify-config";
import { TYPES } from "../../inversify-types";
import { ApplicationResponse, Status } from "../application-response";
import { Error } from "../error";

export class GetBikeByIdQuery {
    @inject(TYPES.IBikeRepository) private bikeRepository: IBikeRepository = 
        container.get<IBikeRepository>(TYPES.IBikeRepository);

    public async getBikeById(bikeId: number, userId: string): Promise<ApplicationResponse> {
        const bike = await this.bikeRepository.getBikeById(bikeId, userId);
        if (bike == undefined) {
            return {
                status: Status.NotFound,
                resource: new Error('Bike not found')
            };
        }

        return {
            status: Status.Ok,
            resource: new BikeResponse(
                bike.name,
                bike.weight,
                bike.user_id,
                bike.id!
            )
        }
    }
}