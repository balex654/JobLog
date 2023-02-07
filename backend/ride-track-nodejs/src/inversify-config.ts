import { Container } from "inversify";
import { IUserRepository } from "./domain/user/iuser-repository";
import { UserRepository } from "./infrastructure/user-repository";
import { TYPES } from "./inversify-types";

const container = new Container();
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
export { container };