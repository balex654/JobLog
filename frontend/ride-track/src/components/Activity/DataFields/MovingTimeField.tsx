import { ActivityResponse } from "../../../model/activity/ActivityResponse";
import { DataField } from "./DataField";

export class MovingTimeField implements DataField<ActivityResponse> {
    data: ActivityResponse;
    setValueFunction: Function;

    constructor(activity: ActivityResponse, setValueFunction: Function) {
        this.data = activity;
        this.setValueFunction = setValueFunction;
    }

    generateValue() {
        let remainder = this.data.moving_time
        const hours = Math.floor(remainder / 3600);
        remainder = remainder - hours * 3600;
        const minutes = Math.floor(remainder / 60);
        remainder = remainder - minutes * 60;
        const seconds = Math.floor(remainder);
        this.setValueFunction(`${hours}:${minutes}:${seconds}`);
    }
}