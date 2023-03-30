import { UserForm } from "../../model/user/UserForm";
import { UserResponse } from "../../model/user/UserResponse";
import axios from "axios";
import { IStorageService } from "../IStorageService";
import { injectable } from "inversify";
import "reflect-metadata";
import { ActivitiesResponse } from "../../model/activity/ActivitiesResponse";
import { ActivityResponse } from "../../model/activity/ActivityResponse";
import { BikeResponse } from "../../model/bike/BikeResponse";
import { GpsPointsResponse } from "../../model/gps-point/GpsPointsResponse";
import { BikesResponse } from "../../model/bike/BikesResponse";
import { BikeForm } from "../../model/bike/BikeForm";
import { StatsResponse } from "../../model/user/StatsResponse";
import { StorageResponse } from "../../model/StorageResponse";

@injectable()
export class HttpStorageService implements IStorageService  {
    private baseUrl = process.env.REACT_APP_API_URL;

    public async createUser(user: UserForm): Promise<StorageResponse<UserResponse>> {
        const { data, status } = await axios.post(`${this.baseUrl}/user`, user).catch(err => err.response);
        return {
            status: status,
            resource: data
        };
    }

    public async getUserById(): Promise<StorageResponse<UserResponse>> {
        const { data, status } = await axios.get<UserResponse>(`${this.baseUrl}/user`).catch(err => err.response);
        return {
            status: status,
            resource: data
        };
    }

    public async editUser(user: UserForm): Promise<StorageResponse<UserResponse>> {
        const { data, status } = await axios.put(`${this.baseUrl}/user`, user).catch(err => err.response);
        return {
            status: status,
            resource: data
        };
    }

    public async getUserStats(): Promise<StorageResponse<StatsResponse>> {
        const { data, status } = await axios.get(`${this.baseUrl}/user/stats`).catch(err => err.response);
        return {
            status: status,
            resource: data
        };
    }

    public async getActivities(): Promise<StorageResponse<ActivitiesResponse>> {
        const { data, status } = await axios.get<ActivitiesResponse>(`${this.baseUrl}/activity`).catch(err => err.response);
        return {
            status: status,
            resource: data
        };
    }

    public async getActivityById(activityId: string): Promise<StorageResponse<ActivityResponse>> {
        const { data, status } = await axios.get<ActivityResponse>(`${this.baseUrl}/activity/${activityId}`).catch(err => err.response)
        return {
            status: status,
            resource: data
        };
    }

    public async getBikeById(bikeId: string): Promise<StorageResponse<BikeResponse>> {
        const { data, status } = await axios.get<BikeResponse>(`${this.baseUrl}/bike/${bikeId}`).catch(err => err.response);
        return {
            status: status,
            resource: data
        };
    }

    public async getBikes(): Promise<StorageResponse<BikesResponse>> {
        const { data, status } = await axios.get<BikesResponse>(`${this.baseUrl}/bike`).catch(err => err.response);
        return {
            status: status,
            resource: data
        };
    }

    public async editBike(bikeId: number, bike: BikeForm): Promise<StorageResponse<BikeResponse>> {
        const { data, status } = await axios.put<BikeResponse>(`${this.baseUrl}/bike/${bikeId}`, bike).catch(err => err.response);
        return {
            status: status,
            resource: data
        };
    }

    public async deleteBike(bikeId: number): Promise<StorageResponse<BikeResponse>> {
        const { data, status } = await axios.delete(`${this.baseUrl}/bike/${bikeId}`).catch(err => err.response);
        return {
            status: status,
            resource: data
        };
    }

    public async addBike(bike: BikeForm): Promise<StorageResponse<BikeResponse>> {
        const { data, status } = await axios.post(`${this.baseUrl}/bike`, bike).catch(err => err.response);
        return {
            status: status,
            resource: data
        };
    }

    public async getGpsPoints(activityId: number): Promise<StorageResponse<GpsPointsResponse>> {
        const { data, status } = await axios.get<GpsPointsResponse>(`${this.baseUrl}/activity/${activityId}/gps-point`).catch(err => err.response);
        return {
            status: status,
            resource: data
        };
    }
}