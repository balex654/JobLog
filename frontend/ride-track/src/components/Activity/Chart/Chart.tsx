import "./Chart.css";
import { GpsPointResponse } from "../../../model/gps-point/GpsPointResponse"
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, YAxis } from 'recharts';
import { useEffect, useState } from "react";
import { GetPowerForTwoPoints } from "../../../common/Calculations";

export interface ChartProps {
    gpsPoints: GpsPointResponse[];
    totalMass: number;
}

interface ChartDataPoint {
    time: string;
    power: number;
    speed: number;
    altitude: number;
}

const Chart = ({gpsPoints, totalMass}: ChartProps) => {
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

    useEffect(() => {
        let data: ChartDataPoint[] = [];
        let i = 0;
        for (i = 0; i < gpsPoints.length - 2; i++) {
            const cur = gpsPoints[i];
            const next = gpsPoints[i + 1];
            let power: number = GetPowerForTwoPoints(cur, next, totalMass);            
            if (power > 300 || power < -300) {
                continue;
            }
            
            data.push({
                time: (new Date(cur.date)).toLocaleTimeString(),
                power: power,
                speed: cur.speed,
                altitude: cur.altitude
            });
        }

        const calculatePowerAverages = (bufferSize: number) => {
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
                const average = buffer.reduce((average, current, index) => {
                    const averageValue = (average.power! + current.power!) / index + 1;
                    return {
                        time: '',
                        speed: 0,
                        power: averageValue,
                        altitude: 0
                    }
                });
                newData[i].power = average.power;
            }

            data = newData;
        }

        calculatePowerAverages(1);
        setChartData(data);
    }, [gpsPoints, totalMass]);

    return (
        <div className="chart-container">
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="20 20" />
                    <YAxis/>
                    <XAxis dataKey="time" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="speed" stroke="#831E1A" activeDot={{ r: 5 }} dot={false}/>
                </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="20 20" />
                    <YAxis/>
                    <XAxis dataKey="time" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="altitude" stroke="#F91A1B" activeDot={{ r: 5 }} dot={false}/>
                </LineChart>
            </ResponsiveContainer>
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="20 20" />
                    <YAxis/>
                    <XAxis dataKey="time" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="power" stroke="#A17F1C" activeDot={{ r: 5 }} dot={false}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Chart