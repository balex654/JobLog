import { User } from "../../domain/user";
import { UserRepository } from "../../infrastructure/user-repository";

export class GetUserByIdCommand {
    public getUserById = async (id: string): Promise<User> => {
        const repo = new UserRepository();
        return await repo.getUserById(id);
    }
}