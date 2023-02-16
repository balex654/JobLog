import { inject } from "inversify";
import { UserForm } from "../../contract/user/user-form";
import { UserResponse } from "../../contract/user/user-response";
import { IUserRepository } from "../../domain/user/iuser-repository";
import { container } from "../../inversify-config";
import { TYPES } from "../../inversify-types";
import { ApplicationResponse, Status } from "../application-response";

export class EditUserCommand {
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository = 
        container.get<IUserRepository>(TYPES.IUserRepository);

    public async editUser(userForm: UserForm): Promise<ApplicationResponse> {
        let user = await this.userRepository.getUserById(userForm.id);
        if (user == undefined) {
            return {
                status: Status.NotFound,
                resource: new Error('User not found')
            };
        }

        user.first_name = userForm.first_name;
        user.last_name = userForm.last_name;
        user.weight = userForm.weight;
        user = await this.userRepository.editUser(user);
        return {
            status: Status.Ok,
            resource: new UserResponse(
                user.first_name,
                user.last_name,
                user.weight,
                user.email,
                user.id
            )
        };
    }
}