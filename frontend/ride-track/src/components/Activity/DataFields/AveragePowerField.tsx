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
            const forceDueToAcc = this.getForceDueToAcceration(cur, next);
            const forceDueToAirResistance = this.getForceDueToAirResistance(cur, next);
            const forceDueToIncline = this.getForceDueToIncline(cur, next)
            const netForce = forceDueToAirResistance + forceDueToAcc + forceDueToIncline;
            const distanceChange = this.getHorizontalDistance(cur, next);
            const work = netForce * distanceChange;
            const timeDifference = this.getTimeDifference(cur.date, next.date);
            const power = work / timeDifference;
            if (power > 0) {
                totalPower += power;
            }
        }

        const averagePower = totalPower / this.data.gpsPoints.length;
        this.setValueFunction(averagePower);
    }

    private getForceDueToIncline(gpsCur: GpsPointResponse, gpsNext: GpsPointResponse): number {
        const altitudeChange = gpsNext.altitude - gpsCur.altitude;
        const distanceChange = this.getHorizontalDistance(gpsCur, gpsNext);
        const sineTheta = this.getSineTheta(altitudeChange, distanceChange);
        const ACCELERATION_DUE_TO_GRAVITY = 9.8
        const forceDueToGravity = this.data.totalMass * ACCELERATION_DUE_TO_GRAVITY;
        const forceDueToIncline = forceDueToGravity * sineTheta;
        return forceDueToIncline;
    }

    private getSineTheta(opposite: number, adjacent: number): number {
        const theta = Math.atan(opposite / adjacent);
        return Math.sin(theta);
    }

    private getHorizontalDistance(gpsCur: GpsPointResponse, gpsNext: GpsPointResponse): number {
        const lat1 = gpsCur.latitude / (180 / Math.PI);
        const long1 = gpsCur.longitude / (180 / Math.PI);
        const lat2 = gpsNext.latitude / (180 / Math.PI);
        const long2 = gpsNext.longitude / (180 / Math.PI);

        const sinLat = Math.sin(lat1) * Math.sin(lat2);
        const cosLat = Math.cos(lat1) * Math.cos(lat2);
        const cosLong = Math.cos(long2 - long1);
        const subProduct = cosLat * cosLong + sinLat;

        const arccos = Math.acos(subProduct);
        const miles = arccos * 3963.0;
        const meters = miles * 1609.344;

        return meters;
    }

    private getForceDueToAirResistance(gpsCur: GpsPointResponse, gpsNext: GpsPointResponse): number {
        const ROW = 1.2;
        const AREA = 1;
        const DRAG_COEFFICIENT = .6;
        const avgVelocity = (gpsCur.speed + gpsNext.speed) / 2;
        const velocitySquared = Math.pow(avgVelocity, 2);
        const forceDueToAirResistance = .5 * ROW * AREA * DRAG_COEFFICIENT * velocitySquared;
        return forceDueToAirResistance;
    }

    private getForceDueToAcceration(gpsCur: GpsPointResponse, gpsNext: GpsPointResponse): number {
        const velocityChange = gpsNext.speed - gpsCur.speed;
        const timeDiffInSeconds = this.getTimeDifference(gpsCur.date, gpsNext.date);
        const acceleration = velocityChange / timeDiffInSeconds;
        const forceDueToAcc = this.data.totalMass * acceleration;
        return forceDueToAcc;
    }

    private getTimeDifference(date1: Date, date2: Date): number {
        date1 = new Date(date1);
        date2 = new Date(date2);
        const MS_PER_SECOND = 1000;
        const seconds = (date2.getTime() - date1.getTime()) / MS_PER_SECOND;
        if (seconds == 0) {
            return 0.5;
        }
        return seconds;
    }
}

/*
If on a decline, subtrack force of gravity from net force
If on an incline, add force of gravity to net force
Always add force of air resistance to net force
Always add force of m*a to net force
*/