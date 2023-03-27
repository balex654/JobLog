import { GetLengthValueByUnit } from "../../../common/Calculations";
import { StatsResponse } from "../../../model/user/StatsResponse";
import { Unit } from "../../../model/user/Unit";
import { UserResponse } from "../../../model/user/UserResponse";
import { DataField } from "./DataField";

export class DistanceYTDStat implements DataField<StatsResponse> {
    data: StatsResponse;
    setValueFunction: Function;

    constructor(stats: StatsResponse, setValueFunction: Function) {
        this.data = stats;
        this.setValueFunction = setValueFunction;
    }

    generateValue(): void {
        const totalKilometers = this.data.total_distance_year / 1000;
        const distanceValue = GetLengthValueByUnit(totalKilometers);
        const unitValue = (JSON.parse(localStorage.getItem('user')!) as UserResponse).unit;
        this.setValueFunction(`${distanceValue.toFixed(2)} ${unitValue === Unit.Imperial ? "mi" : "km"}`);
    }
}