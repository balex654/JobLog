import { IResource } from "../iresource";

export class GpsPointResponse implements IResource {
    public date: Date;
    public speed: number;
    public latitude: number;
    public longitude: number;
    public altitude: number;

    constructor(date: Date, speed: number, latitude: number, longitude: number, altitude: number) {
        this.date = date;
        this.speed = speed;
        this.latitude = latitude;
        this.longitude = longitude;
        this.altitude = altitude;
    }
}