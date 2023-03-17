import { Unit } from "../../../model/user/Unit";
import { UserResponse } from "../../../model/user/UserResponse";
import { ChartDataPoint } from "./Chart";
import "./CustomTooltip.css";

const CustomTooltip = ({...props}: any) => {
    const unitValue = (JSON.parse(localStorage.getItem('user')!) as UserResponse).unit;

    if (props.payload === null || props.payload[0] === undefined) {
        return <div></div>
    }
    
    const payload = props.payload[0];
    const data = payload.payload as ChartDataPoint;
    return (
        <div className="tooltip-container">
            <div>{`Distance ${unitValue === Unit.Imperial ? "(mi)" : "(km)"}: ${data.distance}`}</div>
            <div>{`Speed ${unitValue === Unit.Imperial ? "(mi/hr)" : "(km/hr)"}: ${data.speed}`}</div>
            <div>{`Incline Angle (degrees): ${data.inclineAngle}`}</div>
            <div>{`Altitude ${unitValue === Unit.Imperial ? "(ft)" : "(m)"}: ${data.altitude}`}</div>
            <div>{`Power (watts): ${data.power}`}</div>
            <div>{`Time: ${data.time}`}</div>
        </div>
    )
}

export default CustomTooltip;