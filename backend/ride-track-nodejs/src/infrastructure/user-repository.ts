import { knex } from ".."
import { User } from "../domain/user"

export class UserRepository {
    public getUserById = async (id: string): Promise<User> => {
        return await knex('ride_track_app_user')
                .where('id', id)
                .first();
    }
}