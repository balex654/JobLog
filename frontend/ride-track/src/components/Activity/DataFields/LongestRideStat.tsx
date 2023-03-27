import { GetLengthValueByUnit } from "../../../common/Calculations";
import { StatsResponse } from "../../../model/user/StatsResponse";
import { Unit } from "../../../model/user/Unit";
import { UserResponse } from "../../../model/user/UserResponse";
import { DataField } from "./DataField";

export class LongestRideStat implements DataField<StatsResponse> {
    data: StatsResponse;
    setValueFunction: Function;

    constructor(stats: StatsResponse, setValueFunction: Function) {
        this.data = stats;
        this.setValueFunction = setValueFunction;
    }

    generateValue() {
        let totalKilometers = 0;
        let startDate = "";
        if (this.data.longest_ride !== undefined) {
            totalKilometers = this.data.longest_ride.distance / 1000;
            startDate = (new Date(this.data.longest_ride.activity.start_date)).toLocaleDateString();
        }
        const distanceValue = GetLengthValueByUnit(totalKilometers);
        const unitValue = (JSON.parse(localStorage.getItem('user')!) as UserResponse).unit;
        this.setValueFunction(`${startDate} - ${distanceValue.toFixed(2)} ${unitValue === Unit.Imperial ? "mi" : "km"}`);
    }
}