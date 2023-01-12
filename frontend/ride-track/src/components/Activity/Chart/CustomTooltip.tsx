import { ChartDataPoint } from "./Chart";
import "./CustomTooltip.css";

const CustomTooltip = ({...props}: any) => {
    if (props.payload[0] === undefined) {
        return <div></div>
    }
    
    const payload = props.payload[0];
    const data = payload.payload as ChartDataPoint;
    return (
        <div className="tooltip-container">
            <div>{`${payload.name}: ${payload.value}`}</div>
            <div>{`Distance (mi): ${data.distance}`}</div>
            <div>{`Time: ${data.time}`}</div>
        </div>
    )
}

export default CustomTooltip;