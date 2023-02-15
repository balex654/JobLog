import { IResource } from "../iresource";

export class ActivityResponse implements IResource {
    public id: number;
    public name: string;
    public start_date: Date;
    public end_date: Date;
    public moving_time: number;
    public bike_id: number;
    public user_id: string;
    public total_mass: number;

    constructor(id: number, name: string, start_date: Date, end_date: Date, moving_time: number, bike_id: number, user_id: string, total_mass: number) {
        this.id = id;
        this.name = name;
        this.start_date = start_date;
        this.end_date = end_date;
        this.moving_time = moving_time;
        this.bike_id = bike_id;
        this.user_id = user_id;
        this.total_mass = total_mass;
    }
}