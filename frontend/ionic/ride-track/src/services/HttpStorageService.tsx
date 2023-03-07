import axios from "axios";
import { BikeForm } from "../model/bike/BikeForm";
import { BikeResponse } from "../model/bike/BikeResponse";
import { BikesResponse } from "../model/bike/BikesResponse";
import { StorageResponse } from "../model/StorageResponse";
import { UserForm } from "../model/user/UserForm";
import { UserResponse } from "../model/user/UserResponse";

export class HttpStorageService {
    private baseUrl = process.env.REACT_APP_API_URL;

    public async getUserById(): Promise<StorageResponse<UserResponse>> {
        const { data, status } = await axios.get<UserResponse>(`${this.baseUrl}/user`).catch(err => err.response);
        return {
            status: status,
            resource: data
        };
    }

    public async createUser(user: UserForm): Promise<StorageResponse<UserResponse>> {
        const { data, status } = await axios.post<UserResponse>(`${this.baseUrl}/user`, user).catch(err => err.response);
        return {
            status: status,
            resource: data
        }
    }

    public async getBikes(): Promise<StorageResponse<BikesResponse>> {
        const { data, status } = await axios.get<BikesResponse>(`${this.baseUrl}/bike`).catch(err => err.response);
        return {
            status: status,
            resource: data
        }
    }

    public async editBike(bikeId: number, bike: BikeForm): Promise<StorageResponse<BikeResponse>> {
        const { data, status } = await axios.put<BikeResponse>(`${this.baseUrl}/bike/${bikeId}`, bike).catch(err => err.response);
        return {
            status: status,
            resource: data
        }
    }

    public async deleteBike(bikeId: number): Promise<void> {
        await axios.delete(`${this.baseUrl}/bike/${bikeId}`);
    }

    public async addBike(bike: BikeForm): Promise<StorageResponse<BikeResponse>> {
        const { data, status } = await axios.post<BikeResponse>(`${this.baseUrl}/bike`, bike).catch(err => err.response);
        return {
            status: status,
            resource: data
        }
    }

    public async getBikeById(bikeId: string): Promise<StorageResponse<BikeResponse>> {
        const { data, status } = await axios.get<BikeResponse>(`${this.baseUrl}/bike/${bikeId}`).catch(err => err.response);
        return {
            status: status,
            resource: data
        }
    }
}