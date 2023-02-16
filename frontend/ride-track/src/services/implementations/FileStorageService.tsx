import { injectable } from "inversify";
import { UserForm } from "../../model/user/UserForm";
import { UserResponse } from "../../model/user/UserResponse";
import { IStorageService } from "../IStorageService";
import "reflect-metadata";
import { Users } from "./FileStorage";
import { ActivitiesResponse } from "../../model/activity/ActivitiesResponse";
import { ActivityResponse } from "../../model/activity/ActivityResponse";
import { BikeResponse } from "../../model/bike/BikeResponse";
import { GpsPointsResponse } from "../../model/gps-point/GpsPointsResponse";
import { BikesResponse } from "../../model/bike/BikesResponse";
import { BikeForm } from "../../model/bike/BikeForm";

@injectable()
export class FileStorageService implements IStorageService {
    editUser(): Promise<UserResponse> {
        throw new Error("Method not implemented.");
    }
    addBike(bike: BikeForm): Promise<BikeResponse> {
        throw new Error("Method not implemented.");
    }
    deleteBike(bikeId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    editBike(bikeId: number): Promise<BikeResponse> {
        throw new Error("Method not implemented.");
    }
    getBikes(): Promise<BikesResponse> {
        throw new Error("Method not implemented.");
    }
    getGpsPoints(activityId: number): Promise<GpsPointsResponse> {
        throw new Error("Method not implemented.");
    }
    getBikeById(bikeId: string): Promise<BikeResponse> {
        throw new Error("Method not implemented.");
    }
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