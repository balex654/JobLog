import { GetPowerForTwoPoints } from "../../../common/Calculations";
import { GpsPointResponse } from "../../../model/gps-point/GpsPointResponse";
import { DataField } from "./DataField";

interface AveragePowerFieldData {
    gpsPoints: GpsPointResponse[];
    totalMass: number;
}

export class AveragePowerField implements DataField<AveragePowerFieldData> {
    data: AveragePowerFieldData;
    setValueFunction: Function;
 
    constructor(data: AveragePowerFieldData, setValueFunction: Function) {
        this.data = data;
        this.setValueFunction = setValueFunction;
    }

    generateValue(): void {
        let totalPower = 0;
        let i = 0;
        for (i = 0; i < this.data.gpsPoints.length - 2; i++) {
            const cur = this.data.gpsPoints[i];
            const next = this.data.gpsPoints[i + 1];
            const power = GetPowerForTwoPoints(cur, next, this.data.totalMass);
            if (power > 0) {
                totalPower += power;
            }
        }

        const averagePower = totalPower / this.data.gpsPoints.length;
        this.setValueFunction(`${Math.round(averagePower)} W`);
    }
}

/*
If on a decline, subtrack force of gravity from net force
If on an incline, add force of gravity to net force
Always add force of air resistance to net force
Always add force of m*a to net force
*/