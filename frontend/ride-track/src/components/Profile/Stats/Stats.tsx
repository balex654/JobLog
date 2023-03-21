import { useEffect, useMemo, useState } from "react";
import { BikeStatsResponse } from "../../../model/user/StatsResponse";
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
    const [longestRide, setLongestRide] = useState<string>('loading...');
    const [topSpeed, setTopSpeed] = useState<string>('loading...');
    const [distanceYTD, setDistanceYTD] = useState<string>('loading...');
    const [distanceMTD, setDistacneMTD] = useState<string>('loading...');
    const [bikeStats, setBikeStats] = useState<BikeStatsResponse[]>([]);

    let dataFields: DataField<FieldInput>[] = useMemo(() => [], []);

    useEffect(() => {
        const init = async () => {
            const response = await storageService.getUserStats();
            dataFields.push(new LongestRideStat(response, setLongestRide));
            dataFields.push(new TopSpeedStat(response, setTopSpeed));
            dataFields.push(new DistanceYTDStat(response, setDistanceYTD));
            dataFields.push(new DistanceMTDStat(response, setDistacneMTD));
            dataFields.forEach(f => f.generateValue());
            setBikeStats(response.bike_stats);
        }
        init();
    }, [storageService, dataFields]);

    return (
        <div className="stats-container">
            <p className="title">
                Stats
            </p>
            <div className="stat-field">
                <p>Longest ride (unit):</p>
                <p className="data">{longestRide}</p>
            </div>
            <div className="stat-field">
                <p>Top speed (unit):</p>
                <p className="data">{topSpeed}</p>
            </div>
            <div className="stat-field">
                <p>Total distance this year (unit):</p>
                <p className="data">{distanceYTD}</p>
            </div>
            <div className="stat-field">
                <p>Total distance this month (unit):</p>
                <p className="data">{distanceMTD}</p>
            </div>
            {bikeStats.map(b => {
                return (
                    <div>
                        <p className="bike-header">{b.bike_name}</p>
                        <div className="stat-field">
                            <p>Total distance (unit):</p>
                            <p className="data">{b.total_distance}</p>
                        </div>
                        <div className="stat-field">
                            <p>Average speed (unit):</p>
                            <p className="data">{b.average_speed}</p>
                        </div>
                        <div className="stat-field">
                            <p>Average power (unit):</p>
                            <p className="data">{b.average_power}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default Stats;