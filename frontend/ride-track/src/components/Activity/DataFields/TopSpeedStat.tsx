import { GetVelocityByUnit } from "../../../common/Calculations";
import { StatsResponse } from "../../../model/user/StatsResponse";
import { Unit } from "../../../model/user/Unit";
import { UserResponse } from "../../../model/user/UserResponse";
import { DataField } from "./DataField";

export class TopSpeedStat implements DataField<StatsResponse> {
    data: StatsResponse;
    setValueFunction: Function;

    constructor(stats: StatsResponse, setValueFunction: Function) {
        this.data = stats;
        this.setValueFunction = setValueFunction;
    }

    generateValue(): void {
        let velocity = 0;
        let startDate = "";
        if (this.data.top_speed !== undefined) {
            velocity = GetVelocityByUnit(this.data.top_speed.speed);
            startDate = (new Date(this.data.top_speed.activity.start_date)).toLocaleDateString();
        }
        const unitValue = (JSON.parse(localStorage.getItem('user')!) as UserResponse).unit;
        this.setValueFunction(`${startDate} - ${velocity.toFixed(2)} ${unitValue === Unit.Imperial ? "mi/hr" : "km/hr"}`);
    }
}