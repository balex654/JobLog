import "./Activity.css";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ActivityResponse } from "../../model/activity/ActivityResponse";
import { BikeResponse } from "../../model/bike/BikeResponse";
import { IStorageService } from "../../services/IStorageService";
import { DataField } from "./DataFields/DataField";
import { FieldInput } from "./DataFields/FieldInput";
import { StartDateField } from "./DataFields/StartDateField";
import { EndDateField } from "./DataFields/EndDateField";
import { MovingTimeField } from "./DataFields/MovingTimeField";
import { BikeUsedField } from "./DataFields/BikeUsedField";

interface ActivityProps {
    storageService: IStorageService;
}

const Activity = ({storageService}: ActivityProps) => {
    const { id } = useParams();

    const [activityName, setActivityName] = useState<string>('');
    const [startDateValue, setStartDateValue] = useState<string>('');
    const [endDateValue, setEndDateValue] = useState<string>('');
    const [movingTimeValue, setMovingTimeValue] = useState<string>('');
    const [bikeUsedValue, setBikeUsedValue] = useState<string>('');

    let dataFields: DataField<FieldInput>[] = useMemo(() => [], []);

    useEffect(() => {
        let activity: ActivityResponse;
        let bike: BikeResponse;
        const init = async () => {
            activity = await storageService.getActivityById(id!);
            const bikeId = activity!.bike_id.toString();
            bike = await storageService.getBikeById(bikeId);
            setDataFields();
        }

        const setDataFields = () => {
            setActivityName(activity.name);
            dataFields.push(new StartDateField(activity, setStartDateValue));
            dataFields.push(new EndDateField(activity, setEndDateValue));
            dataFields.push(new MovingTimeField(activity, setMovingTimeValue));
            dataFields.push(new BikeUsedField(bike, setBikeUsedValue));
            dataFields.forEach(f => f.generateValue());
        }
        
        init();
    }, [storageService, id, dataFields]);

    return (
        <div className="activity-container">
            <p className="title">
                {activityName}
            </p>
            <div className="data-fields">
                <div className="data-field-group">
                    <div className="data-field">
                        <p>Start time:</p>
                        <p className="data">{startDateValue}</p>
                    </div>
                    <div className="data-field">
                        <p>End time:</p>
                        <p className="data">{endDateValue}</p>
                    </div>
                </div>
                <div className="data-field-group">
                    <div className="data-field">
                        <p>Moving time:</p>
                        <p className="data">{movingTimeValue}</p>
                    </div>
                    <div className="data-field">
                        <p>Bike used:</p>
                        <p className="data">{bikeUsedValue}</p>
                    </div>
                </div>
                <div className="data-field-group">
                    <div className="data-field">
                        <p>Average power:</p>
                        <p className="data">0000</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Activity;