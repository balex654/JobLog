import { IResource } from "../iresource";
import { GpsPointResponse } from "./gps-point-response";

export class GpsPointsResponse implements IResource {
    public gps_points: GpsPointResponse[];

    constructor(gps_points: GpsPointResponse[]) {
        this.gps_points = gps_points;
    }
}