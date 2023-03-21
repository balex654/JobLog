import { ActivityResponse } from "../../activity/activity-response";

export class StatsResponse {
    public longest_ride: LongestRideResponse;
    public top_speed: TopSpeedResponse;
    public total_distance_year: number;
    public total_distance_month: number;
    public bike_stats: BikeStatsResponse[];

    constructor(
        longest_ride: LongestRideResponse,
        top_speed: TopSpeedResponse,
        total_distance_year: number,
        total_distance_month: number,
        bike_stats: BikeStatsResponse[]) {
        this.longest_ride = longest_ride;
        this.top_speed = top_speed;
        this.total_distance_year = total_distance_year;
        this.total_distance_month = total_distance_month;
        this.bike_stats = bike_stats;
    }
}

export interface LongestRideResponse {
    activity: ActivityResponse;
    distance: number;
}

export interface TopSpeedResponse {
    activity: ActivityResponse;
    speed: number;
}

export interface BikeStatsResponse {
    bike_name: string;
    total_distance: number;
    average_speed: number;
    average_power: number;
}