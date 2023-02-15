import { inject } from "inversify";
import { GpsPointResponse } from "../../contract/gps-points/gps-point-response";
import { GpsPointsResponse } from "../../contract/gps-points/gps-points-response";
import { IGpsPointRepository } from "../../domain/gps-point/igps-point-repository";
import { container } from "../../inversify-config";
import { TYPES } from "../../inversify-types";
import { ApplicationResponse, Status } from "../application-response";

export class GetGpsPointsByActivityIdQuery {
    @inject(TYPES.IGpsPointRepository) private gpsPointRepository: IGpsPointRepository =
        container.get<IGpsPointRepository>(TYPES.IGpsPointRepository);

    public async getGpsPointsByActivityId(activityId: number, userId: string): Promise<ApplicationResponse> {
        const gpsPoints = await this.gpsPointRepository.getGpsPointsByActivityId(userId, activityId);
        const gpsPointsResponse = new GpsPointsResponse(gpsPoints.map(g => 
            new GpsPointResponse(
                g.date, 
                g.speed, 
                g.latitude,
                g.longitude,
                g.altitude)
        ));
        return {
            status: Status.Ok,
            resource: gpsPointsResponse
        };
    }
}