import { inject } from "inversify";
import { ActivitiesResponse } from "../../contract/activity/activities-response";
import { ActivityResponse } from "../../contract/activity/activity-response";
import { IActivityRepository } from "../../domain/activity/iactivity-repository";
import { ActivityRepository } from "../../infrastructure/activity-repository";
import { container } from "../../inversify-config";
import { TYPES } from "../../inversify-types";
import { ApplicationResponse, Status } from "../application-response";

export class GetActivitiesQuery {
    @inject(TYPES.IActivityRepository) private activityRepository: IActivityRepository
        = container.get<IActivityRepository>(TYPES.IActivityRepository);
    
    public async getActivites(userId: string): Promise<ApplicationResponse> {
        const activities = await this.activityRepository.getActivities(userId);
        const activitiesResponse = new ActivitiesResponse(activities.map(a => 
            new ActivityResponse(
                a.id!,
                a.name,
                a.start_date,
                a.end_date,
                a.moving_time,
                a.bike_id,
                a.user_id,
                a.total_mass
            )));
        return {
            status: Status.Ok,
            resource: activitiesResponse
        };
    }
}