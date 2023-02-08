import { inject } from "inversify";
import { BikeForm } from "../../contract/bike/bike-form";
import { BikeResponse } from "../../contract/bike/bike-response";
import { Bike } from "../../domain/bike/bike";
import { IBikeRepository } from "../../domain/bike/ibike-repository";
import { container } from "../../inversify-config";
import { TYPES } from "../../inversify-types";
import { ApplicationResponse, Status } from "../application-response";

export class AddBikeCommand {
    @inject(TYPES.IBikeRepository) private bikeRepository: IBikeRepository = 
        container.get<IBikeRepository>(TYPES.IBikeRepository);

    public async addBike(bikeForm: BikeForm, userId: string): Promise<ApplicationResponse> {
        const bike = await this.bikeRepository.addBike(new Bike(
            bikeForm.name,
            bikeForm.weight,
            userId,
            false
        ));
        return {
            status: Status.Created,
            resource: new BikeResponse(
                bike.name,
                bike.weight,
                bike.user_id,
                bike.id!
            )
        };
    }
}