import { Stats } from "./stats/stats";
import { User } from "./user";

export interface IUserRepository {
    getUserById(id: string): Promise<User>;
    addUser(user: User): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    editUser(user: User): Promise<User>;
    getUserStats(user: User): Promise<Stats>;
}