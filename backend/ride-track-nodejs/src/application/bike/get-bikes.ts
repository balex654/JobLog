import { inject } from "inversify";
import { BikeResponse } from "../../contract/bike/bike-response";
import { BikesResponse } from "../../contract/bike/bikes-response";
import { IBikeRepository } from "../../domain/bike/ibike-repository";
import { container } from "../../inversify-config";
import { TYPES } from "../../inversify-types";
import { ApplicationResponse, Status } from "../application-response";

export class GetBikesQuery {
    @inject(TYPES.IBikeRepository) private bikeRepository: IBikeRepository 
        = container.get<IBikeRepository>(TYPES.IBikeRepository);

    public async getBikes(userId: string): Promise<ApplicationResponse> {
        const bikes = await this.bikeRepository.getBikes(userId);
        const bikesResponse = new BikesResponse(bikes.map(b => 
            new BikeResponse(
                b.name,
                b.weight,
                b.user_id,
                b.id!
        )));
        return {
            status: Status.Ok,
            resource: bikesResponse
        };
    }
}