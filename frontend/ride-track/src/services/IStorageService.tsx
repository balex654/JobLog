import { interfaces } from "inversify";
import { ActivitiesResponse } from "../model/activity/ActivitiesResponse";
import { UserForm } from "../model/user/UserForm";
import { UserResponse } from "../model/user/UserResponse";

export interface IStorageService {
    createUser(user: UserForm): Promise<UserResponse>;
    getUserById(): Promise<UserResponse>;
    getActivities(): Promise<ActivitiesResponse>;
}