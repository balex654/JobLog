import { GpsPoint } from "../domain/gps-point/gps-point";

export function GetHorizontalDistance(gpsCur: GpsPoint, gpsNext: GpsPoint): number {
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

export function GetPowerForTwoPoints(cur: GpsPoint, next: GpsPoint, totalMass: number): number {
    const forceDueToAcc = GetForceDueToAcceration(cur, next, totalMass);
    const forceDueToAirResistance = GetForceDueToAirResistance(cur, next);
    const forceDueToIncline = GetForceDueToIncline(cur, next, totalMass)
    const netForce = forceDueToAirResistance + forceDueToAcc + forceDueToIncline;
    const distanceChange = GetHorizontalDistance(cur, next);
    const work = netForce * distanceChange;
    const timeDifference = GetTimeDifference(cur.date, next.date);
    const power = work / timeDifference;
    return power;
}

function GetForceDueToIncline(gpsCur: GpsPoint, gpsNext: GpsPoint, totalMass: number): number {
    const altitudeChange = gpsNext.altitude - gpsCur.altitude;
    const distanceChange = GetHorizontalDistance(gpsCur, gpsNext);
    const sineTheta = GetSineTheta(altitudeChange, distanceChange);
    const ACCELERATION_DUE_TO_GRAVITY = 9.8
    const forceDueToGravity = totalMass * ACCELERATION_DUE_TO_GRAVITY;
    const forceDueToIncline = forceDueToGravity * sineTheta;
    return forceDueToIncline;
}

function GetSineTheta(opposite: number, adjacent: number): number {
    const theta = Math.atan(opposite / adjacent);
    return Math.sin(theta);
}

function GetForceDueToAirResistance(gpsCur: GpsPoint, gpsNext: GpsPoint): number {
    const ROW = 1.2;
    const AREA = 1;
    const DRAG_COEFFICIENT = .6;
    const avgVelocity = (gpsCur.speed + gpsNext.speed) / 2;
    const velocitySquared = Math.pow(avgVelocity, 2);
    const forceDueToAirResistance = .5 * ROW * AREA * DRAG_COEFFICIENT * velocitySquared;
    return forceDueToAirResistance;
}

function GetForceDueToAcceration(gpsCur: GpsPoint, gpsNext: GpsPoint, totalMass: number): number {
    const velocityChange = gpsNext.speed - gpsCur.speed;
    const timeDiffInSeconds = GetTimeDifference(gpsCur.date, gpsNext.date);
    const acceleration = velocityChange / timeDiffInSeconds;
    const forceDueToAcc = totalMass * acceleration;
    return forceDueToAcc;
}

function GetTimeDifference(date1: Date, date2: Date): number {
    date1 = new Date(date1);
    date2 = new Date(date2);
    const MS_PER_SECOND = 1000;
    const seconds = (date2.getTime() - date1.getTime()) / MS_PER_SECOND;
    if (seconds === 0) {
        return 0.5;
    }
    return seconds;
}