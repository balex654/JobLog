import { GpsPointForm } from "../gps-points/gps-point-form";

export interface ActivityForm {
    name: string;
    start_date: Date;
    end_date: Date;
    moving_time: number;
    bike_id: number;
    total_mass: number;
    gps_points: GpsPointForm[];
}