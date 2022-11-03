import { injectable } from "inversify";
import { UserForm } from "../../model/user/UserForm";
import { UserResponse } from "../../model/user/UserResponse";
import { IStorageService } from "../IStorageService";
import "reflect-metadata";
import { Users } from "./FileStorage";
import { ActivitiesResponse } from "../../model/activity/ActivitiesResponse";
import { ActivityResponse } from "../../model/activity/ActivityResponse";

@injectable()
export class FileStorageService implements IStorageService {
    getActivityById(activityId: string): Promise<ActivityResponse> {
        throw new Error("Method not implemented.");
    }
    getActivities(): Promise<ActivitiesResponse> {
        throw new Error("Method not implemented.");
    }
    public async createUser(user: UserForm): Promise<UserResponse> {
        const users: any[] = Users;
        let maxId = users.length > 0 ? users[users.length - 1].id : 0;

        const domainUser = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            id: maxId + 1,
            weight: user.weight
        };
        users.push(domainUser);

        return new Promise((resolve) => {
            const userResponse: UserResponse = {
                first_name: domainUser.first_name,
                last_name: domainUser.last_name,
                email: domainUser.email,
                id: domainUser.id,
                weight: domainUser.weight
            };
            resolve(userResponse);
        });
    }

    public getUserById(): Promise<UserResponse> {
        throw new Error("Method not implemented.");
    }
}