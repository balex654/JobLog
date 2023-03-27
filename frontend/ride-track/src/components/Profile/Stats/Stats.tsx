import { useEffect, useMemo, useState } from "react";
import { GetLengthValueByUnit, GetVelocityByUnit } from "../../../common/Calculations";
import { Status } from "../../../model/StorageResponse";
import { BikeStatsResponse, StatsResponse } from "../../../model/user/StatsResponse";
import { Unit } from "../../../model/user/Unit";
import { UserResponse } from "../../../model/user/UserResponse";
import { IStorageService } from "../../../services/IStorageService";
import { DataField } from "../../Activity/DataFields/DataField";
import { DistanceMTDStat } from "../../Activity/DataFields/DistanceMTDStat";
import { DistanceYTDStat } from "../../Activity/DataFields/DistanceYTDStat";
import { FieldInput } from "../../Activity/DataFields/FieldInput";
import { LongestRideStat } from "../../Activity/DataFields/LongestRideStat";
import { TopSpeedStat } from "../../Activity/DataFields/TopSpeedStat";
import "./Stats.css";

interface StatsProps {
    storageService: IStorageService;
}

const Stats = ({storageService}: StatsProps) => {
    const [stats, setStats] = useState<StatsResponse>();
    const [longestRide, setLongestRide] = useState<string>('loading...');
    const [topSpeed, setTopSpeed] = useState<string>('loading...');
    const [distanceYTD, setDistanceYTD] = useState<string>('loading...');
    const [distanceMTD, setDistacneMTD] = useState<string>('loading...');
    const [bikeStats, setBikeStats] = useState<BikeStatsResponse[]>([]);

    let dataFields: DataField<FieldInput>[] = useMemo(() => [], []);
    const unitValue = (JSON.parse(localStorage.getItem('user')!) as UserResponse).unit;

    useEffect(() => {
        const init = async () => {
            const response = await storageService.getUserStats();
            if (response.status === Status.Ok) {
                setStats(response.resource!);
                dataFields.push(new LongestRideStat(response.resource!, setLongestRide));
                dataFields.push(new TopSpeedStat(response.resource!, setTopSpeed));
                dataFields.push(new DistanceYTDStat(response.resource!, setDistanceYTD));
                dataFields.push(new DistanceMTDStat(response.resource!, setDistacneMTD));
                dataFields.forEach(f => f.generateValue());
                setBikeStats(response.resource!.bike_stats);
            }
        }
        init();
    }, [storageService, dataFields]);

    const getFormattedDistance = (meters: number): string => {
        const totalKilometers = meters / 1000;
        const distanceValue = GetLengthValueByUnit(totalKilometers);
        return `${distanceValue.toFixed(2)} ${unitValue === Unit.Imperial ? "mi" : "km"}`;
    }

    const getFormattedSpeed = (ms: number): string => {
        const velocity = GetVelocityByUnit(ms);
        return `${velocity.toFixed(2)} ${unitValue === Unit.Imperial ? "mi/hr" : "km/hr"}`
    }

    const getFormattedPower = (power: number): string => {
        return `${power.toFixed(0)} W`;
    }

    return (
        <div className="stats-container">
            {stats !== undefined ? 
                (<div>
                    <p className="title">
                        Stats
                    </p>
                    <div className="stat-field">
                        <p>Longest ride:</p>
                        <a 
                            className="data stats-link" 
                            href={`/#/dashboard/activity/${stats?.longest_ride.activity.id}`}>
                                {longestRide}
                        </a>
                    </div>
                    <div className="stat-field">
                        <p>Top speed:</p>
                        <a 
                            className="data stats-link"
                            href={`/#/dashboard/activity/${stats?.top_speed.activity.id}`}>
                                {topSpeed}
                        </a>
                    </div>
                    <div className="stat-field">
                        <p>Total distance this year:</p>
                        <p className="data">{distanceYTD}</p>
                    </div>
                    <div className="stat-field">
                        <p>Total distance this month:</p>
                        <p className="data">{distanceMTD}</p>
                    </div>
                    {bikeStats.map(b => {
                        return (
                            <div>
                                <p className="bike-header">{b.bike_name}</p>
                                <div className="stat-field">
                                    <p>Total distance:</p>
                                    <p className="data">{getFormattedDistance(b.total_distance)}</p>
                                </div>
                                <div className="stat-field">
                                    <p>Average speed:</p>
                                    <p className="data">{getFormattedSpeed(b.average_speed)}</p>
                                </div>
                                <div className="stat-field">
                                    <p>Average power:</p>
                                    <p className="data">{getFormattedPower(b.average_power)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>)
                :
                (<div></div>)
            }
            
        </div>
    )
}

export default Stats;