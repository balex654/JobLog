import { ActivitiesResponse } from "../model/activity/ActivitiesResponse";
import { ActivityResponse } from "../model/activity/ActivityResponse";
import { BikeResponse } from "../model/bike/BikeResponse";
import { UserForm } from "../model/user/UserForm";
import { UserResponse } from "../model/user/UserResponse";

export interface IStorageService {
    createUser(user: UserForm): Promise<UserResponse>;
    getUserById(): Promise<UserResponse>;
    getActivities(): Promise<ActivitiesResponse>;
    getActivityById(activityId: string): Promise<ActivityResponse>;
    getBikeById(bikeId: string): Promise<BikeResponse>;
}