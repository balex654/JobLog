import "./Chart.css";
import { GpsPointResponse } from "../../../model/gps-point/GpsPointResponse"
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, YAxis } from 'recharts';
import { useEffect, useState } from "react";
import { GetHorizontalDistance, GetInclineAngle, GetLengthValueByUnit, GetPowerForTwoPoints, GetShortLengthValueByUnit, GetVelocityByUnit } from "../../../common/Calculations";
import CustomTooltip from "./CustomTooltip";
import { UserResponse } from "../../../model/user/UserResponse";
import { Unit } from "../../../model/user/Unit";

export interface ChartProps {
    gpsPoints: GpsPointResponse[];
    totalMass: number;
}

export interface ChartDataPoint {
    time: string;
    power: number;
    speed: number;
    altitude: number;
    inclineAngle: number;
    distance: number;
}

const Chart = ({gpsPoints, totalMass}: ChartProps) => {
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const unitValue = (JSON.parse(localStorage.getItem('user')!) as UserResponse).unit;

    useEffect(() => {
        let data: ChartDataPoint[] = [];
        let totalDistance = 0;
        let i = 0;
        for (i = 0; i < gpsPoints.length - 2; i++) {
            const cur = gpsPoints[i];
            const next = gpsPoints[i + 1];
            const speed = GetVelocityByUnit(cur.speed);
            const altitude = GetShortLengthValueByUnit(cur.altitude);
            const distance = GetLengthValueByUnit(GetHorizontalDistance(cur, next) * 0.001);
            totalDistance += distance;
            let inclineAngle = GetInclineAngle(cur, next);
            let power: number = GetPowerForTwoPoints(cur, next, totalMass);            
            if (power > 500 || power < -500) {
                continue;
            }
            
            const date = new Date(cur.date);
            const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes().toString();
            const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds().toString();
            data.push({
                time: `${date.getHours()}:${minutes}:${seconds}`,
                power: power,
                speed: Number(speed.toFixed(1)),
                altitude: Number(altitude.toFixed(0)),
                inclineAngle: inclineAngle,
                distance: Number(totalDistance.toFixed(2))
            });
        }

        const calculateMovingAverages = (bufferSize: number, dataName: string, decimalPlaces: number) => {
            let newData = data.map(d => d);
            let i = 0;
            for (i = 0; i < data.length - 1; i++) {
                let upperSlice = i + bufferSize + 1;
                if (upperSlice > data.length) {
                    upperSlice = data.length;
                }

                let lowerSlice = i - bufferSize;
                if (lowerSlice < 0) {
                    lowerSlice = 0;
                }

                const buffer = data.slice(lowerSlice, upperSlice);
                const sum = buffer.map(d => (d as any)[dataName]).reduce((partial, current) => {
                    return partial + current;
                }, 0);
                let average = sum / (bufferSize * 2 + 1);
                average = Number(average.toFixed(decimalPlaces));
                (newData[i] as any)[dataName] = average;
            }

            data = newData;
        }

        calculateMovingAverages(2, "power", 0);
        calculateMovingAverages(5, "inclineAngle", 1)
        setChartData(data);
    }, [gpsPoints, totalMass]);

    return (
        <div className="chart-container">
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="20 20" />
                    <YAxis/>
                    <XAxis dataKey="distance"/>
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="speed" 
                        stroke="#9e1919" 
                        activeDot={{ r: 5 }} 
                        dot={false} 
                        name={`Speed ${unitValue === Unit.Imperial ? "(mi/hr)" : "(km/hr)"}`}/>
                </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="20 20" />
                    <YAxis/>
                    <XAxis dataKey="distance" />
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend />
                    <Line  
                        type="monotone" 
                        dataKey="inclineAngle" 
                        stroke="#19299e" 
                        activeDot={{ r: 5 }} 
                        dot={false} 
                        name="Incline Angle (degrees)"/>
                </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="20 20" />
                    <YAxis/>
                    <XAxis dataKey="distance" />
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="altitude" 
                        stroke="#199e29" 
                        activeDot={{ r: 5 }} 
                        dot={false} 
                        name={`Altitude ${unitValue === Unit.Imperial ? "(ft)" : "(m)"}`}/>
                </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="20 20" />
                    <YAxis/>
                    <XAxis dataKey="distance" />
                    <Tooltip content={<CustomTooltip/>}/>
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="power" 
                        stroke="#9e7019" 
                        activeDot={{ r: 5 }} 
                        dot={false} 
                        name="Power (watts)"/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Chart