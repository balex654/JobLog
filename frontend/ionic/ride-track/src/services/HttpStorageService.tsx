import axios from "axios";
import { Status, StorageResponse } from "../model/StorageResponse";
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
}