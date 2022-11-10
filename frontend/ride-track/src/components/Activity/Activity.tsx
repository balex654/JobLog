import "./Activity.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ActivityResponse } from "../../model/activity/ActivityResponse";
import { BikeResponse } from "../../model/bike/BikeResponse";
import { IStorageService } from "../../services/IStorageService";
import { DataField } from "./DataFields/DataField";
import { FieldInput } from "./DataFields/FieldInput";
import { StartDateField } from "./DataFields/StartDateField";
import { EndDateField } from "./DataFields/EndDateField";

interface ActivityProps {
    storageService: IStorageService;
}

const Activity = ({storageService}: ActivityProps) => {
    const { id } = useParams();

    let activity: ActivityResponse;
    let bike: BikeResponse;

    const [activityName, setActivityName] = useState<string>('');
    const [startDateValue, setStartDateValue] = useState<string>('');
    const [endDateValue, setEndDateValue] = useState<string>('');

    let dataFields: DataField<FieldInput>[] = [];

    useEffect(() => {
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
            dataFields.forEach(f => f.generateValue());
        }
        
        init();
    }, [storageService, id]);

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
                        <p className="data">0000</p>
                    </div>
                    <div className="data-field">
                        <p>Bike used:</p>
                        <p className="data">0000</p>
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