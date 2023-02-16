import { ActivitiesResponse } from "../model/activity/ActivitiesResponse";
import { ActivityResponse } from "../model/activity/ActivityResponse";
import { BikeForm } from "../model/bike/BikeForm";
import { BikeResponse } from "../model/bike/BikeResponse";
import { BikesResponse } from "../model/bike/BikesResponse";
import { GpsPointsResponse } from "../model/gps-point/GpsPointsResponse";
import { UserForm } from "../model/user/UserForm";
import { UserResponse } from "../model/user/UserResponse";

export interface IStorageService {
    createUser(user: UserForm): Promise<UserResponse>;
    getUserById(): Promise<UserResponse>;
    editUser(user: UserForm): Promise<UserResponse>;
    getActivities(): Promise<ActivitiesResponse>;
    getActivityById(activityId: string): Promise<ActivityResponse>;
    getBikeById(bikeId: string): Promise<BikeResponse>;
    getBikes(): Promise<BikesResponse>;
    deleteBike(bikeId: number): Promise<void>;
    editBike(bikeId: number, bike: BikeForm): Promise<BikeResponse>;
    addBike(bike: BikeForm): Promise<BikeResponse>;
    getGpsPoints(activityId: number): Promise<GpsPointsResponse>;
}