import { IUserRepository } from "../../domain/user/iuser-repository";
import { TYPES } from "../../inversify-types";
import { inject } from "inversify";
import { container } from "../../inversify-config";
import { ApplicationResponse, Status } from "../application-response";
import { Error } from "../error";
import { UserResponse } from "../../contract/user/user-response";

export class GetUserByIdQuery {
    @inject(TYPES.IUserRepository) private userRepository: IUserRepository 
        = container.get<IUserRepository>(TYPES.IUserRepository);
    
    public getUserById = async (id: string): Promise<ApplicationResponse> => {
        const user = await this.userRepository.getUserById(id);
        if (user == undefined) {
            return {
                status: Status.NotFound,
                resource: new Error('User not found')
            };
        }

        return {
            status: Status.Ok,
            resource: new UserResponse(
                user.first_name, 
                user.last_name, 
                user.weight,
                user.email,
                user.id,
                user.unit)
        };
    }
}