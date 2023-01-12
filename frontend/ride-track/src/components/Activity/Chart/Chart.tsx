import "./Chart.css";
import { GpsPointResponse } from "../../../model/gps-point/GpsPointResponse"
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, YAxis } from 'recharts';
import { useEffect, useState } from "react";
import { ConvertMetersToFeet, ConvertMStoMilesPerHour, GetInclineAngle, GetPowerForTwoPoints } from "../../../common/Calculations";

export interface ChartProps {
    gpsPoints: GpsPointResponse[];
    totalMass: number;
}

interface ChartDataPoint {
    time: string;
    power: number;
    speed: number;
    altitude: number;
    inclineAngle: number;
}

const Chart = ({gpsPoints, totalMass}: ChartProps) => {
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

    useEffect(() => {
        let data: ChartDataPoint[] = [];
        let i = 0;
        for (i = 0; i < gpsPoints.length - 2; i++) {
            const cur = gpsPoints[i];
            const next = gpsPoints[i + 1];
            const milesPerHour = ConvertMStoMilesPerHour(cur.speed);
            const altitudeFeet = ConvertMetersToFeet(cur.altitude);
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
                speed: milesPerHour,
                altitude: altitudeFeet,
                inclineAngle: inclineAngle
            });
        }

        const calculateMovingAverages = (bufferSize: number, dataName: string) => {
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
                const average = sum / (bufferSize * 2 + 1);
                (newData[i] as any)[dataName] = average;
            }

            data = newData;
        }

        calculateMovingAverages(2, "power");
        calculateMovingAverages(5, "inclineAngle")
        setChartData(data);
    }, [gpsPoints, totalMass]);

    return (
        <div className="chart-container">
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="20 20" />
                    <YAxis/>
                    <XAxis dataKey="time" />
                    <Tooltip/>
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="speed" 
                        stroke="#9e1919" 
                        activeDot={{ r: 5 }} 
                        dot={false} 
                        name="Speed (mi/hr)"/>
                </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="20 20" />
                    <YAxis/>
                    <XAxis dataKey="time" />
                    <Tooltip />
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
                    <XAxis dataKey="time" />
                    <Tooltip />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="altitude" 
                        stroke="#199e29" 
                        activeDot={{ r: 5 }} 
                        dot={false} 
                        name="Altitude (ft)"/>
                </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="20 20" />
                    <YAxis/>
                    <XAxis dataKey="time" />
                    <Tooltip />
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