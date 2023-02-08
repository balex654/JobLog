import { BikeResponse } from "./bike-response";

export class BikesResponse {
    public bikes: BikeResponse[];

    constructor(bikes: BikeResponse[]) {
        this.bikes = bikes;
    }
}