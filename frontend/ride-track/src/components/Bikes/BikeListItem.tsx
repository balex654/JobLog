import { BikeResponse } from "../../model/bike/BikeResponse";

export interface BikeListItem {
    bike: BikeResponse;
    isEditing: boolean;
    index: number;
}