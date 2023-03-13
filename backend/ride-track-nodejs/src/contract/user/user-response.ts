import { Unit } from "../../domain/unit";
import { IResource } from "../iresource";

export class UserResponse implements IResource {
    public first_name: string;
    public last_name: string;
    public weight: number;
    public email: string;
    public id: string;
    public unit: Unit;

    constructor(
        first_name: string, 
        last_name: string, 
        weight: number,
        email: string,
        id: string,
        unit: Unit) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.weight = weight;
        this.email = email;
        this.id = id;
        this.unit = unit;
    }
}