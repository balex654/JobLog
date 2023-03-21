import { StatsResponse } from "../../../model/user/StatsResponse";
import { DataField } from "./DataField";

export class LongestRideStat implements DataField<StatsResponse> {
    data: StatsResponse;
    setValueFunction: Function;

    constructor(stats: StatsResponse, setValueFunction: Function) {
        this.data = stats;
        this.setValueFunction = setValueFunction;
    }

    generateValue() {
        this.setValueFunction(`${this.data.longest_ride.distance}`);
    }
}