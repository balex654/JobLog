import { GetVelocityByUnit } from "../../../common/Calculations";
import { GpsPointResponse } from "../../../model/gps-point/GpsPointResponse";
import { Unit } from "../../../model/user/Unit";
import { DataField } from "./DataField";

export class AverageSpeedField implements DataField<GpsPointResponse[]> {
    data: GpsPointResponse[];
    setValueFunction: Function;
    unit: Unit;

    constructor(data: GpsPointResponse[], setValueFunction: Function, unit: Unit) {
        this.data = data;
        this.setValueFunction = setValueFunction;
        this.unit = unit;
    }

    generateValue(): void {
        let total = 0;
        this.data.forEach(g => {
            total += g.speed;
        });
        let average = total / this.data.length;

        const unitAdjustedValue = GetVelocityByUnit(average, this.unit);
        this.setValueFunction(`${unitAdjustedValue.toFixed(1)} ${this.unit === Unit.Imperial ? "mi/hr" : "km/hr"}`);
    }
}