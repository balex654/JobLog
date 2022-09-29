import { UserForm } from "../../model/user/UserForm";
import { UserResponse } from "../../model/user/UserResponse";
import axios from "axios";
import { IStorageService } from "../IStorageService";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class HttpStorageService implements IStorageService {
    baseUrl = process.env.REACT_APP_API_URL;

    public async createUser(user: UserForm): Promise<UserResponse> {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }
        return await axios.post(`${this.baseUrl}/user`, user, config);
    }

    public async callApi(accessToken: string): Promise<any> {
        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
        return await axios.get(`${this.baseUrl}/user/auth-test`, config)
    }

    public async getUserByEmail(): Promise<UserResponse> {
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }
        return await axios.get(`${this.baseUrl}/user`, config);
    }
}