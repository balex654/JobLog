import { GetVelocityByUnit } from "../../../common/Calculations";
import { GpsPointResponse } from "../../../model/gps-point/GpsPointResponse";
import { Unit } from "../../../model/user/Unit";
import { DataField } from "./DataField";

export class MaxSpeedField implements DataField<GpsPointResponse[]> {
    data: GpsPointResponse[];
    setValueFunction: Function;
    unit: Unit;

    constructor(data: GpsPointResponse[], setValueFunction: Function, unit: Unit) {
        this.data = data;
        this.setValueFunction = setValueFunction;
        this.unit = unit;
    }

    generateValue(): void {
        let max = 0;
        this.data.forEach(d => {
            if (d.speed > max) {
                max = d.speed;
            }
        });
        
        const velocity = GetVelocityByUnit(max, this.unit);
        this.setValueFunction(`${velocity.toFixed(1)} ${this.unit === Unit.Imperial ? "mi/hr" : "km/hr"}`);
    }
}