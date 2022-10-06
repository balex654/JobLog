import { UserForm } from "../../model/user/UserForm";
import { UserResponse } from "../../model/user/UserResponse";
import axios from "axios";
import { IStorageService } from "../IStorageService";
import { injectable } from "inversify";
import "reflect-metadata";

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
        return await axios.post(`${this.baseUrl}/user`, user, this.config);
    }

    public async getUserByEmail(): Promise<UserResponse> {
        return await axios.get(`${this.baseUrl}/user`, this.config);
    }
}