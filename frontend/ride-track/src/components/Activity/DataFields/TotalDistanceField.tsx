import { ConvertMetersToMiles, GetHorizontalDistance } from "../../../common/Calculations";
import { GpsPointResponse } from "../../../model/gps-point/GpsPointResponse";
import { DataField } from "./DataField";

export class TotalDistanceField implements DataField<GpsPointResponse[]> {
    data: GpsPointResponse[];
    setValueFunction: Function;

    constructor(data: GpsPointResponse[], setValueFunction: Function) {
        this.data = data;
        this.setValueFunction = setValueFunction;
    }

    generateValue(): void {
        let totalDistance = 0;
        let i = 0;
        for (i = 0; i < this.data.length - 2; i++) {
            const cur = this.data[i];
            const next = this.data[i + 1];
            let distance = ConvertMetersToMiles(GetHorizontalDistance(cur, next));
            totalDistance += distance;
        }

        this.setValueFunction(`${totalDistance.toFixed(2)} mi`);
    }
}