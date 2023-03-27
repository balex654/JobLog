import { ActivitiesResponse } from "../model/activity/ActivitiesResponse";
import { ActivityResponse } from "../model/activity/ActivityResponse";
import { BikeForm } from "../model/bike/BikeForm";
import { BikeResponse } from "../model/bike/BikeResponse";
import { BikesResponse } from "../model/bike/BikesResponse";
import { GpsPointsResponse } from "../model/gps-point/GpsPointsResponse";
import { StorageResponse } from "../model/StorageResponse";
import { StatsResponse } from "../model/user/StatsResponse";
import { UserForm } from "../model/user/UserForm";
import { UserResponse } from "../model/user/UserResponse";

export interface IStorageService {
    createUser(user: UserForm): Promise<StorageResponse<UserResponse>>;
    getUserById(): Promise<StorageResponse<UserResponse>>;
    editUser(user: UserForm): Promise<StorageResponse<UserResponse>>;
    getUserStats(): Promise<StorageResponse<StatsResponse>>;
    getActivities(): Promise<StorageResponse<ActivitiesResponse>>;
    getActivityById(activityId: string): Promise<StorageResponse<ActivityResponse>>;
    getBikeById(bikeId: string): Promise<StorageResponse<BikeResponse>>;
    getBikes(): Promise<StorageResponse<BikesResponse>>;
    deleteBike(bikeId: number): Promise<StorageResponse<BikeResponse>>;
    editBike(bikeId: number, bike: BikeForm): Promise<StorageResponse<BikeResponse>>;
    addBike(bike: BikeForm): Promise<StorageResponse<BikeResponse>>;
    getGpsPoints(activityId: number): Promise<StorageResponse<GpsPointsResponse>>;
}