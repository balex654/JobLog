import { inject } from "inversify";
import { UserForm } from "../../contract/user/user-form";
import { UserResponse } from "../../contract/user/user-response";
import { IUserRepository } from "../../domain/user/iuser-repository";
import { User } from "../../domain/user/user";
import { container } from "../../inversify-config";
import { TYPES } from "../../inversify-types";
import { ApplicationResponse, Status } from "../application-response";
import { Error } from "../error";

export class AddUserCommand {
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository = container.get<IUserRepository>(TYPES.IUserRepository);
    
    public addUser = async (userForm: UserForm): Promise<ApplicationResponse> => {
        const existingUser = await this.userRepository.getUserByEmail(userForm.email);
        if (existingUser !== undefined) {
            return {
                status: Status.BadRequest,
                resource: new Error('A user with that email already exists')
            }
        }
        
        const user = await this.userRepository.addUser(new User(
            userForm.first_name,
            userForm.last_name,
            userForm.weight,
            userForm.email,
            userForm.id
        ));
        return {
            status: Status.Created,
            resource: new UserResponse(
                user.first_name,
                user.last_name,
                user.weight,
                user.email,
                user.id)
        };
    }
}