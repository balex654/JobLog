import { GetVelocityByUnit } from "../../../common/Calculations";
import { GpsPointResponse } from "../../../model/gps-point/GpsPointResponse";
import { Unit } from "../../../model/user/Unit";
import { UserResponse } from "../../../model/user/UserResponse";
import { DataField } from "./DataField";

export class AverageSpeedField implements DataField<GpsPointResponse[]> {
    data: GpsPointResponse[];
    setValueFunction: Function;

    constructor(data: GpsPointResponse[], setValueFunction: Function) {
        this.data = data;
        this.setValueFunction = setValueFunction;
    }

    generateValue(): void {
        let total = 0;
        this.data.forEach(g => {
            total += g.speed;
        });
        let average = total / this.data.length;

        const unit = (JSON.parse(localStorage.getItem('user')!) as UserResponse).unit;
        const unitAdjustedValue = GetVelocityByUnit(average);
        this.setValueFunction(`${unitAdjustedValue.toFixed(1)} ${unit === Unit.Imperial ? "mi/hr" : "km/hr"}`);
    }
}