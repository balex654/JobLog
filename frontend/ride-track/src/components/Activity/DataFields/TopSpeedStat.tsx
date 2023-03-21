import { StatsResponse } from "../../../model/user/StatsResponse";
import { DataField } from "./DataField";

export class TopSpeedStat implements DataField<StatsResponse> {
    data: StatsResponse;
    setValueFunction: Function;

    constructor(stats: StatsResponse, setValueFunction: Function) {
        this.data = stats;
        this.setValueFunction = setValueFunction;
    }

    generateValue(): void {
        this.setValueFunction(`${this.data.top_speed.speed}`)
    }
}