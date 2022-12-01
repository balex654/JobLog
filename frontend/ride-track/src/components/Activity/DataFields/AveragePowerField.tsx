import { GpsPointsResponse } from "../../../model/gps-point/GpsPointsResponse";
import { DataField } from "./DataField";

export class AveragePowerField implements DataField<GpsPointsResponse> {
    data: GpsPointsResponse;
    setValueFunction: Function;
 
    constructor(gpsPoints: GpsPointsResponse, setValueFunction: Function) {
        this.data = gpsPoints;
        this.setValueFunction = setValueFunction;
    }

    generateValue(): void {
        this.setValueFunction(this.data.gps_points[0].altitude);
    }
}