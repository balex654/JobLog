import { ActivityResponse } from "../activity/ActivityResponse";

export interface StatsResponse {
    longest_ride: LongestRideResponse;
    top_speed: TopSpeedResponse;
    total_distance_year: number;
    total_distance_month: number;
    bike_stats: BikeStatsResponse[];
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