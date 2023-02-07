import { User } from "./user";

export interface IUserRepository {
    getUserById(id: string): Promise<User>;
}