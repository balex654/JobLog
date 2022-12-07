import { FieldInput } from "../../components/Activity/DataFields/FieldInput";

export class ActivityResponse implements FieldInput {
    name: string = '';
    start_date: Date = new Date();
    end_date: Date = new Date();
    moving_time: number = 0;
    user_id: string = '';
    bike_id: number = 0;
    id: number = 0;
}