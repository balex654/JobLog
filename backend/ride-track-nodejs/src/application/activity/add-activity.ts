import { inject } from "inversify";
import { ActivityForm } from "../../contract/activity/activity-form";
import { Activity } from "../../domain/activity/activity";
import { IActivityRepository } from "../../domain/activity/iactivity-repository";
import { GpsPoint } from "../../domain/gps-point/gps-point";
import { container } from "../../inversify-config";
import { TYPES } from "../../inversify-types";
import { ApplicationResponse, Status } from "../application-response";

export class AddActivityCommand {
    @inject(TYPES.IActivityRepository) private activityRepository: IActivityRepository =
        container.get<IActivityRepository>(TYPES.IActivityRepository);

    public async addActivity(activityForm: ActivityForm, userId: string): Promise<ApplicationResponse> {
        await this.activityRepository.addActivity(new Activity(
                activityForm.name,
                activityForm.start_date,
                activityForm.end_date,
                activityForm.moving_time,
                activityForm.bike_id,
                userId,
                activityForm.total_mass
            ),
            activityForm.gps_points.map(g => new GpsPoint(
                g.date, g.speed, g.latitude, g.longitude, g.altitude
            )));
        return {
            status: Status.Created,
            resource: undefined
        }
    }
}