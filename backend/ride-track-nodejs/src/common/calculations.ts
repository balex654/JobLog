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