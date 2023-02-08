import { Container } from "inversify";
import { IBikeRepository } from "./domain/bike/ibike-repository";
import { IUserRepository } from "./domain/user/iuser-repository";
import { BikeRepository } from "./infrastructure/bike-repository";
import { UserRepository } from "./infrastructure/user-repository";
import { TYPES } from "./inversify-types";

const container = new Container();
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IBikeRepository>(TYPES.IBikeRepository).to(BikeRepository);
export { container };