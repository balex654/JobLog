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
        let minutes = Math.floor(remainder / 60);
        remainder = remainder - minutes * 60;
        let seconds = Math.floor(remainder);
        let minutesStr = minutes.toString();
        let secondsStr = seconds.toString();
        if (minutes < 10) {
            minutesStr = minutesStr.padStart(2, '0');
        }
        if (seconds < 10) {
            secondsStr = secondsStr.padStart(2, '0');
        }
        this.setValueFunction(`${hours}:${minutesStr}:${secondsStr}`);
    }
}