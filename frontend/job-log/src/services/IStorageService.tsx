import { interfaces } from "inversify";
import { UserForm } from "../model/user/UserForm";
import { UserResponse } from "../model/user/UserResponse";

export interface IStorageService {
    createUser(user: UserForm): Promise<UserResponse>;
}