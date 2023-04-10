import { ActivityResponse } from "../../../model/activity/ActivityResponse";
import { DataField } from "./DataField";

export class EndDateField implements DataField<ActivityResponse> {
    data: ActivityResponse;
    setValueFunction: Function;

    constructor(activity: ActivityResponse, setValueFunction: Function) {
        this.data = activity;
        this.setValueFunction = setValueFunction;
    }

    generateValue() {
        this.setValueFunction(new Date(this.data.end_date).toLocaleTimeString());
    }
}