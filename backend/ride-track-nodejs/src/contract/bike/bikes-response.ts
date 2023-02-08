import { IResource } from "../iresource";
import { BikeResponse } from "./bike-response";

export class BikesResponse implements IResource {
    public bikes: BikeResponse[];

    constructor(bikes: BikeResponse[]) {
        this.bikes = bikes;
    }
}