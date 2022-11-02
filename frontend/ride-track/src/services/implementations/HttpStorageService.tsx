import { UserForm } from "../../model/user/UserForm";
import { UserResponse } from "../../model/user/UserResponse";
import axios from "axios";
import { IStorageService } from "../IStorageService";
import { injectable } from "inversify";
import "reflect-metadata";
import { ActivitiesResponse } from "../../model/activity/ActivitiesResponse";

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
}