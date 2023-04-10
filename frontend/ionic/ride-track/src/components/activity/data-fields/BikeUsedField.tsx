import { BikeResponse } from "../../../model/bike/BikeResponse";
import { DataField } from "./DataField";

export class BikeUsedField implements DataField<BikeResponse> {
    data: BikeResponse;
    setValueFunction: Function;

    constructor(bike: BikeResponse, setValueFunction: Function) {
        this.data = bike;
        this.setValueFunction = setValueFunction;
    }

    generateValue() {
        this.setValueFunction(this.data.name);
    }
}