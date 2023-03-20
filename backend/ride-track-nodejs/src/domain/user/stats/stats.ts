import { Activity } from "../../activity/activity";

export class Stats {
    public longest_ride: LongestRide;
    public top_speed: TopSpeed;
    public total_distance_year: number;
    public total_distance_month: number;
    public bike_stats: BikeStats[];

    constructor(
        longest_ride: LongestRide,
        top_speed: TopSpeed,
        total_distance_year: number,
        total_distance_month: number,
        bike_stats: BikeStats[]) {
        this.longest_ride = longest_ride;
        this.top_speed = top_speed;
        this.total_distance_year = total_distance_year;
        this.total_distance_month = total_distance_month;
        this.bike_stats = bike_stats;
    }
}

export interface LongestRide {
    activity: Activity;
    distance: number;
}

export interface TopSpeed {
    activity: Activity;
    speed: number;
}

export interface BikeStats {
    total_distance: number;
    average_speed: number;
    average_power: number;
}