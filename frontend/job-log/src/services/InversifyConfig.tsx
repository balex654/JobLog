import { Container } from "inversify";
import { HttpStorageService } from "./HttpStorageService";
import { IStorageService } from "./IStorageService";
import { TYPES } from "./Types";

const container = new Container();
container.bind<IStorageService>(TYPES.IStorageService).to(HttpStorageService);

export { container };