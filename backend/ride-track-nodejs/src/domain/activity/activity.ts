export class Activity {
    public name: string;
    public start_date: Date;
    public end_date: Date;
    public moving_time: number;
    public bike_id: number;
    public user_id: string;
    public total_mass: number;
    public id?: number;

    constructor(name: string, start_date: Date, end_date: Date, moving_time: number, bike_id: number, user_id: string, total_mass: number, id?: number) {
        this.name = name;
        this.start_date = start_date;
        this.end_date = end_date;
        this.moving_time = moving_time;
        this.bike_id = bike_id;
        this.user_id = user_id;
        this.total_mass = total_mass;
        this.id = id;
    }
}