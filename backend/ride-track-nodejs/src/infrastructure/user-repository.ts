import { knex } from ".."
import { User } from "../domain/user/user"
import { injectable } from "inversify";
import { IUserRepository } from "../domain/user/iuser-repository";

@injectable()
export class UserRepository implements IUserRepository {
    public async getUserById(id: string): Promise<User> {
        return await knex('ride_track_app_user')
                .where('id', id)
                .first();
    }

    public async getUserByEmail(email: string): Promise<User> {
        return await knex('ride_track_app_user')
                .where('email', email)
                .first();
    }

    public async addUser(user: User): Promise<User> {
        await knex('ride_track_app_user')
                .insert({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    weight: user.weight,
                    email: user.email,
                    id: user.id,
                    unit: user.unit
                });
        return user;
    }

    public async editUser(user: User): Promise<User> {
        await knex('ride_track_app_user')
                .where({id: user.id})
                .update({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    weight: user.weight,
                    unit: user.unit
                });
        return user;
    }
}