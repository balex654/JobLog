import { GetVelocityByUnit } from "../../../common/Calculations";
import { GpsPointResponse } from "../../../model/gps-point/GpsPointResponse";
import { Unit } from "../../../model/user/Unit";
import { UserResponse } from "../../../model/user/UserResponse";
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

        const velocity = GetVelocityByUnit(max);
        const unitValue = (JSON.parse(localStorage.getItem('user')!) as UserResponse).unit;
        this.setValueFunction(`${velocity.toFixed(1)} ${unitValue === Unit.Imperial ? "mi/hr" : "km/hr"}`);
    }
}