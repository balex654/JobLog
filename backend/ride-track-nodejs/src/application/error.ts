import { IResource } from "../contract/iresource";

export class Error implements IResource {
    public message: string;

    constructor(message: string) {
        this.message = message;
    }
}