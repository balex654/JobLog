import { ConvertMStoMilesPerHour } from "../../../common/Calculations";
import { GpsPointResponse } from "../../../model/gps-point/GpsPointResponse";
import { DataField } from "./DataField";

export class MaxSpeedField implements DataField<GpsPointResponse[]> {
    data: GpsPointResponse[];
    setValueFunction: Function;

    constructor(data: GpsPointResponse[], setValueFunction: Function) {
        this.data = data;
        this.setValueFunction = setValueFunction;
    }

    generateValue(): void {
        let max = 0;
        this.data.forEach(d => {
            if (d.speed > max) {
                max = d.speed;
            }
        });

        const milesPerHour = ConvertMStoMilesPerHour(max);
        this.setValueFunction(`${milesPerHour.toFixed(1)} mi/hr`);
    }
}