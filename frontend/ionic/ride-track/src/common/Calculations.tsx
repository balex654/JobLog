import { GpsPointResponse } from "../model/gps-point/GpsPointResponse";
import { Unit } from "../model/user/Unit";

export function GetPowerForTwoPoints(cur: GpsPointResponse, next: GpsPointResponse, totalMass: number): number {
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

function GetForceDueToIncline(gpsCur: GpsPointResponse, gpsNext: GpsPointResponse, totalMass: number): number {
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

export function GetHorizontalDistance(gpsCur: GpsPointResponse, gpsNext: GpsPointResponse): number {
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

function GetForceDueToAirResistance(gpsCur: GpsPointResponse, gpsNext: GpsPointResponse): number {
    const ROW = 1.2;
    const AREA = 1;
    const DRAG_COEFFICIENT = .6;
    const avgVelocity = (gpsCur.speed + gpsNext.speed) / 2;
    const velocitySquared = Math.pow(avgVelocity, 2);
    const forceDueToAirResistance = .5 * ROW * AREA * DRAG_COEFFICIENT * velocitySquared;
    return forceDueToAirResistance;
}

function GetForceDueToAcceration(gpsCur: GpsPointResponse, gpsNext: GpsPointResponse, totalMass: number): number {
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

export function GetInclineAngle(cur: GpsPointResponse, next: GpsPointResponse): number {
    const altitudeChange = next.altitude - cur.altitude;
    const distanceChange = GetHorizontalDistance(cur, next);
    const thetaRadians = Math.atan(altitudeChange / distanceChange);
    const thetaDegrees = thetaRadians * (180 / Math.PI);
    return thetaDegrees;
}

export function ConvertPoundsToKilos(pounds: number): number {
    const kilos = pounds * 0.453592;
    const rounded = Math.round(kilos * 10) / 10;
    return rounded;
}

export function ConvertKilosToPounds(kilos: number): number {
    const pounds = kilos * 2.20462;
    const rounded = Math.round(pounds * 10) / 10;
    return rounded;
}

export function ConvertKilometersToMiles(kilometers: number): number {
    const miles = kilometers * 0.621371;
    return miles;
}

export function ConvertMStoMilesPerHour(ms: number): number {
    // m/s * s/hr * mi/m
    const metersPerHour = ms * 3600;
    const milesPerHour = metersPerHour * 0.000621371;
    return milesPerHour;
}

export function ConvertMStoKPH(ms: number): number {
    // m/s * s/hr * km/m
    const metersPerHour = ms * 3600;
    const kilometersPerHour = metersPerHour * 0.001;
    return kilometersPerHour;
}

export function ConvertMetersToFeet(meters: number): number {
    const feet = meters * 3.28;
    return feet;
}

export function GetWeightInKilos(weight: number, unit: Unit): number {
    if (unit === Unit.Imperial) {
        return ConvertPoundsToKilos(weight);
    }
    else {
        return weight;
    }
}

export function GetWeightValueByUnit(kilos: number, unit: Unit): number {
    if (unit === Unit.Imperial) {
        return ConvertKilosToPounds(kilos);
    }
    else {
        return kilos;
    }
}

export function GetLengthValueByUnit(kilometers: number, unit: Unit): number {
    if (unit === Unit.Imperial) {
        return ConvertKilometersToMiles(kilometers);
    }
    else {
        return kilometers;
    }
}

export function GetShortLengthValueByUnit(meters: number, unit: Unit): number {
    if (unit === Unit.Imperial) {
        return ConvertMetersToFeet(meters);
    }
    else {
        return meters;
    }
}

export function GetVelocityByUnit(metersPerSecond: number, unit: Unit): number {
    if (unit === Unit.Imperial) {
        return ConvertMStoMilesPerHour(metersPerSecond);
    }
    else {
        return ConvertMStoKPH(metersPerSecond);
    }
}