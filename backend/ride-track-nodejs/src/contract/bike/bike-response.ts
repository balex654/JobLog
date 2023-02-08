import { IResource } from "../iresource";

export class BikeResponse implements IResource {
    public name: string;
    public weight: number;
    public user_id: string;
    public id: number;

    constructor(name: string, weight: number, user_id: string, id: number) {
        this.name = name;
        this.weight = weight;
        this.user_id = user_id;
        this.id = id;
    }
}