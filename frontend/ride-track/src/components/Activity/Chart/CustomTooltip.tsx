import { ChartDataPoint } from "./Chart";
import "./CustomTooltip.css";

const CustomTooltip = ({...props}: any) => {
    if (props.payload === null || props.payload[0] === undefined) {
        return <div></div>
    }
    
    const payload = props.payload[0];
    const data = payload.payload as ChartDataPoint;
    return (
        <div className="tooltip-container">
            <div>{`Distance (mi): ${data.distance}`}</div>
            <div>{`Speed (mi/hr): ${data.speed}`}</div>
            <div>{`Incline Angle (degrees): ${data.inclineAngle}`}</div>
            <div>{`Altitude (ft): ${data.altitude}`}</div>
            <div>{`Power (watts): ${data.power}`}</div>
            <div>{`Time: ${data.time}`}</div>
        </div>
    )
}

export default CustomTooltip;