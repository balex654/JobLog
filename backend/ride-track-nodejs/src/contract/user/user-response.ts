import { IResource } from "../iresource";

export class UserResponse implements IResource {
    public first_name: string;
    public last_name: string;
    public weight: number;
    public email: string;
    public id: string;

    constructor(
        first_name: string, 
        last_name: string, 
        weight: number,
        email: string,
        id: string) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.weight = weight;
        this.email = email;
        this.id = id;
    }
}