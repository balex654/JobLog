export class GpsPoint {
    public date: Date;
    public speed:  number;
    public latitude: number;
    public longitude: number;
    public altitude: number;
    public activityId?: number;
    public id?: number;

    constructor(date: Date, speed: number, latitude: number, longitude: number, altitude: number, activityId?: number, id?: number) {
        this.date = date;
        this.speed = speed;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
        this.activityId = activityId;
        this.id = id;
    }
}