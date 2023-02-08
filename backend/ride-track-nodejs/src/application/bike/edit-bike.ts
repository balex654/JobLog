import { inject } from "inversify";
import { BikeForm } from "../../contract/bike/bike-form";
import { BikeResponse } from "../../contract/bike/bike-response";
import { IBikeRepository } from "../../domain/bike/ibike-repository";
import { container } from "../../inversify-config";
import { TYPES } from "../../inversify-types";
import { ApplicationResponse, Status } from "../application-response";
import { Error } from "../error";

export class EditBikeCommand {
    @inject(TYPES.IBikeRepository) private bikeRepository: IBikeRepository = 
        container.get<IBikeRepository>(TYPES.IBikeRepository);

    public async editBike(bikeForm: BikeForm, bikeId: number, userId: string): Promise<ApplicationResponse> {
        let bike = await this.bikeRepository.getBikeById(bikeId, userId);
        if (bike == undefined) {
            return {
                status: Status.NotFound,
                resource: new Error('Bike not found')
            };
        }
        
        bike.name = bikeForm.name;
        bike.weight = bikeForm.weight;
        bike = await this.bikeRepository.editBike(bike, userId);
        return {
            status: Status.Ok,
            resource: new BikeResponse(
                bike.name,
                bike.weight,
                bike.user_id,
                bike.id!
            )
        };
    }
}