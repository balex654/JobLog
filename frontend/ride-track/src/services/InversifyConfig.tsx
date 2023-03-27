import { Container } from "inversify";
import { HttpStorageService } from "./implementations/HttpStorageService";
import { IStorageService } from "./IStorageService";
import { TYPES } from "./Types";

const container = new Container();
const useLocalApi = true;
if (process.env.NODE_ENV === 'production' || useLocalApi) {
    container.bind<IStorageService>(TYPES.IStorageService).to(HttpStorageService);
}

export { container };