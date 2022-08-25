import { UserForm } from "../model/user/UserForm";
import { UserResponse } from "../model/user/UserResponse";
import axios from "axios";
import { IStorageService } from "./IStorageService";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class HttpStorageService implements IStorageService {
    baseUrl = process.env.REACT_APP_API_URL;

    public async createUser(user: UserForm): Promise<UserResponse> {
        return await axios.post(`${this.baseUrl}/user`, user);
    }
}