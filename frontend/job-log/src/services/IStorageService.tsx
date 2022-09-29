import { interfaces } from "inversify";
import { UserForm } from "../model/user/UserForm";
import { UserResponse } from "../model/user/UserResponse";

export interface IStorageService {
    createUser(user: UserForm): Promise<UserResponse>;
    callApi(accessToken: string): Promise<any>;
    getUserByEmail(): Promise<UserResponse>;
}