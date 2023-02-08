import { inject } from "inversify";
import { IBikeRepository } from "../../domain/bike/ibike-repository";
import { container } from "../../inversify-config";
import { TYPES } from "../../inversify-types";
import { ApplicationResponse, Status } from "../application-response";
import { Error } from "../error";

export class DeleteBikeCommand {
    @inject(TYPES.IBikeRepository) private bikeRepository: IBikeRepository = 
        container.get<IBikeRepository>(TYPES.IBikeRepository);

    public async deleteBikeCommand(bikeId: number, userId: string): Promise<ApplicationResponse> {
        const bike = await this.bikeRepository.getBikeById(bikeId, userId);
        if (bike == undefined) {
            return {
                status: Status.NotFound,
                resource: new Error('Bike not found')
            };
        }

        await this.bikeRepository.deleteBike(bikeId, userId);
        return {
            status: Status.NoContent,
            resource: undefined
        }
    }
}