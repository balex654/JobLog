import { GetShortLengthValueByUnit } from "../../../common/Calculations";
import { GpsPointResponse } from "../../../model/gps-point/GpsPointResponse";
import { Unit } from "../../../model/user/Unit";
import { DataField } from "./DataField";

export class ElevationGainField implements DataField<GpsPointResponse[]> {
    data: GpsPointResponse[];
    setValueFunction: Function;
    unit: Unit;

    constructor(data: GpsPointResponse[], setValueFunction: Function, unit: Unit) {
        this.data = data;
        this.setValueFunction = setValueFunction;
        this.unit = unit;
    }

    generateValue(): void {
        let gain = 0;
        let i = 0;
        let bufferSize = 40;
        for (i = 0; i < this.data.length - 2 - bufferSize; i++) {
            let averageWindow1 = 0;
            let j = i;
            let sum = 0;
            for (j = i; j < i + bufferSize; j++) {
                sum += this.data[j].altitude;
            }
            averageWindow1 = sum / bufferSize;

            let averageWindow2 = 0;
            sum = 0;
            for (j = i + 1; j < i + 1 + bufferSize; j++) {
                sum += this.data[j].altitude;
            }
            averageWindow2 = sum / bufferSize;

            let change = averageWindow2 - averageWindow1;
            if (change > 0) {
                gain += change;
            }
        }

        const unitAdjustedValue = GetShortLengthValueByUnit(gain, this.unit);
        this.setValueFunction(`${unitAdjustedValue.toFixed(0)} ${this.unit === Unit.Imperial ? "ft" : "m"}`);
    }
}