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

@injectable()
export class HttpStorageService implements IStorageService {
    private baseUrl = process.env.REACT_APP_API_URL;
    private get config(): any {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }
        return config;
    }

    public async createUser(user: UserForm): Promise<UserResponse> {
        const { data } = await axios.post(`${this.baseUrl}/user`, user, this.config);
        return data;
    }

    public async getUserById(): Promise<UserResponse> {
        const { data } = await axios.get<UserResponse>(`${this.baseUrl}/user`, this.config);
        return data;
    }

    public async getActivities(): Promise<ActivitiesResponse> {
        const { data } = await axios.get<ActivitiesResponse>(`${this.baseUrl}/activity`, this.config);
        return data;
    }

    public async getActivityById(activityId: string): Promise<ActivityResponse> {
        const { data } = await axios.get<ActivityResponse>(`${this.baseUrl}/activity/${activityId}`, this.config)
        return data;
    }

    public async getBikeById(bikeId: string): Promise<BikeResponse> {
        const { data } = await axios.get<BikeResponse>(`${this.baseUrl}/bike/${bikeId}`, this.config);
        return data;
    }

    public async getBikes(): Promise<BikesResponse> {
        const { data } = await axios.get<BikesResponse>(`${this.baseUrl}/bike`, this.config);
        return data;
    }

    public async editBike(bikeId: number, bike: BikeForm): Promise<BikeResponse> {
        const { data } = await axios.put<BikeResponse>(`${this.baseUrl}/bike/${bikeId}`, bike, this.config);
        return data;
    }

    public async deleteBike(bikeId: number): Promise<void> {
        await axios.delete(`${this.baseUrl}/bike/${bikeId}`, this.config);
    }

    public async addBike(bike: BikeForm): Promise<BikeResponse> {
        const { data } = await axios.post(`${this.baseUrl}/bike`, bike, this.config);
        return data;
    }

    public async getGpsPoints(activityId: number): Promise<GpsPointsResponse> {
        const { data } = await axios.get<GpsPointsResponse>(`${this.baseUrl}/activity/${activityId}/gps-point`, this.config);
        return data;
    }
}