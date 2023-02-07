import { knex } from ".."
import { User } from "../domain/user/user"
import { injectable } from "inversify";
import { IUserRepository } from "../domain/user/iuser-repository";

@injectable()
export class UserRepository implements IUserRepository {
    public getUserById = async (id: string): Promise<User> => {
        return await knex('ride_track_app_user')
                .where('id', id)
                .first();
    }
}