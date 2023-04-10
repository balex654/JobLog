import { GetHorizontalDistance, GetLengthValueByUnit } from "../../../common/Calculations";
import { GpsPointResponse } from "../../../model/gps-point/GpsPointResponse";
import { Unit } from "../../../model/user/Unit";
import { DataField } from "./DataField";

export class TotalDistanceField implements DataField<GpsPointResponse[]> {
    data: GpsPointResponse[];
    setValueFunction: Function;
    unit: Unit;

    constructor(data: GpsPointResponse[], setValueFunction: Function, unit: Unit) {
        this.data = data;
        this.setValueFunction = setValueFunction;
        this.unit = unit;
    }

    generateValue(): void {
        let totalMeters = 0;
        let i = 0;
        for (i = 0; i < this.data.length - 2; i++) {
            const cur = this.data[i];
            const next = this.data[i + 1];
            let distance = GetHorizontalDistance(cur, next);
            totalMeters += distance;
        }

        const totalKilometers = totalMeters / 1000;
        const distanceValue = GetLengthValueByUnit(totalKilometers, this.unit);
        this.setValueFunction(`${distanceValue.toFixed(2)} ${this.unit === Unit.Imperial ? "mi" : "km"}`);
    }
}