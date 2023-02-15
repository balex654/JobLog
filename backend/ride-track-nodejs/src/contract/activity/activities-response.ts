import { IResource } from "../iresource";
import { ActivityResponse } from "./activity-response";

export class ActivitiesResponse implements IResource {
    public activities: ActivityResponse[];

    constructor(activities: ActivityResponse[]) {
        this.activities = activities;
    }
}