import { inject } from "inversify";
import { ActivityResponse } from "../../contract/activity/activity-response";
import { IActivityRepository } from "../../domain/activity/iactivity-repository";
import { container } from "../../inversify-config";
import { TYPES } from "../../inversify-types";
import { ApplicationResponse, Status } from "../application-response";

export class GetActivityByIdQuery {
    @inject(TYPES.IActivityRepository) private activityRepository: IActivityRepository = 
        container.get<IActivityRepository>(TYPES.IActivityRepository);
    
    public async getActivityById(activityId: number, userId: string): Promise<ApplicationResponse> {
        const activity = await this.activityRepository.getActivityById(userId, activityId);
        if (activity == undefined) {
            return {
                status: Status.NotFound,
                resource: new Error('Activity not found')
            };
        }

        return {
            status: Status.Ok,
            resource: new ActivityResponse(
                activity.id!,
                activity.name,
                activity.start_date,
                activity.end_date,
                activity.moving_time,
                activity.bike_id,
                activity.user_id,
                activity.total_mass
            )
        };
    }
}