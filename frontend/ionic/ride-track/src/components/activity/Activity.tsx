import { IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useHistory, useParams } from "react-router-dom";
import { chevronBack } from "ionicons/icons";
import { useEffect, useMemo, useState } from "react";
import { HttpStorageService } from "../../services/HttpStorageService";
import "./Activity.css";
import { DataField } from "./data-fields/DataField";
import { FieldInput } from "./data-fields/FieldInput";
import { StartDateField } from "./data-fields/StartDateField";
import { EndDateField } from "./data-fields/EndDateField";
import { MovingTimeField } from "./data-fields/MovingTimeField";
import { BikeUsedField } from "./data-fields/BikeUsedField";
import { MaxSpeedField } from "./data-fields/MaxSpeedField";
import { TotalDistanceField } from "./data-fields/TotalDistanceField";
import { AveragePowerField } from "./data-fields/AveragePowerField";
import { Storage, Drivers } from "@ionic/storage";
import { UserResponse } from "../../model/user/UserResponse";
import Chart, { ChartProps } from "./chart/Chart";
import { AverageSpeedField } from "./data-fields/AverageSpeedField";
import { ElevationGainField } from "./data-fields/ElevationGainField";
import Map from "./map/Map";
import { GpsPointResponse } from "../../model/gps-point/GpsPointResponse";

const Activity = () => {
    const id = parseInt((useParams() as any).id);
    const history = useHistory();
    const [storageService] = useState<HttpStorageService>(new HttpStorageService());
    const [storage] = useState<Storage>(new Storage({
        name: "storage",
        driverOrder: [Drivers.LocalStorage]
    }));
    storage.create();
    
    const [activityName, setActivityName] = useState<string>('loading...');
    const [startDateValue, setStartDateValue] = useState<string>('loading...');
    const [endDateValue, setEndDateValue] = useState<string>('loading...');
    const [movingTimeValue, setMovingTimeValue] = useState<string>('loading...');
    const [bikeUsedValue, setBikeUsedValue] = useState<string>('loading...');
    const [averagePowerValue, setAveragePowerValue] = useState<string>('loading...');
    const [maxSpeedValue, setMaxSpeedValue] = useState<string>('loading...');
    const [totalDistanceValue, setTotalDistanceValue] = useState<string>('loading...');
    const [averageSpeedValue, setAverageSpeedValue] = useState<string>('loading...');
    const [elevationGainValue, setElevationGainValue] = useState<string>('loading...');

    let dataFields: DataField<FieldInput>[] = useMemo(() => [], []);
    const [chartData, setChartData] = useState<ChartProps>({
        gpsPoints: [],
        totalMass: 0
    });
    const [mapGpsPoints, setMapGpsPoints] = useState<number[][]>([]);

    useEffect(() => {
        const createMapPoints = (gpsPoints: GpsPointResponse[]) => {
            const points = gpsPoints.map(g => {
                return [g.longitude, g.latitude];
            });
            setMapGpsPoints(points);
        }

        const init = async () => {
            const activity = (await storageService.getActivityById(id)).resource!;
            const bike = (await storageService.getBikeById(activity.bike_id.toString())).resource!;
            const gpsPoints = (await storageService.getGpsPoints(activity.id)).resource!;
            const unit = (JSON.parse(await storage.get("user")) as UserResponse).unit;
            createMapPoints(gpsPoints.gps_points);
            setActivityName(activity.name);
            dataFields.push(new StartDateField(activity, setStartDateValue));
            dataFields.push(new EndDateField(activity, setEndDateValue));
            dataFields.push(new MovingTimeField(activity, setMovingTimeValue));
            dataFields.push(new BikeUsedField(bike, setBikeUsedValue));
            dataFields.push(new MaxSpeedField(gpsPoints.gps_points, setMaxSpeedValue, unit));
            dataFields.push(new TotalDistanceField(gpsPoints.gps_points, setTotalDistanceValue, unit));
            const avgPowerFieldData = {
                gpsPoints: gpsPoints.gps_points,
                totalMass: activity.total_mass
            };
            dataFields.push(new AveragePowerField(avgPowerFieldData, setAveragePowerValue));
            dataFields.push(new AverageSpeedField(gpsPoints.gps_points, setAverageSpeedValue, unit));
            dataFields.push(new ElevationGainField(gpsPoints.gps_points, setElevationGainValue, unit));
            dataFields.forEach(f => f.generateValue());
            setChartData({
                gpsPoints: gpsPoints.gps_points,
                totalMass: activity.total_mass
            });
        }

        init();
    }, [storageService, id, dataFields, storage]);

    const handleBack = () => {
        history.goBack();
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        {activityName}
                    </IonTitle>
                    <div className="back-button-container">
                        <IonIcon icon={chevronBack}/>
                        <button onClick={handleBack} className="back-button">Back</button>
                    </div>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">
                            {activityName}
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div className="activity-container">
                    <div className="data-fields">
                        <div className="data-field">
                            <p>Start time:</p>
                            <p className="data">{startDateValue}</p>
                        </div>
                        <div className="data-field">
                            <p>End time:</p>
                            <p className="data">{endDateValue}</p>
                        </div>
                        <div className="data-field">
                            <p>Moving time:</p>
                            <p className="data">{movingTimeValue}</p>
                        </div>
                        <div className="data-field">
                            <p>Bike used:</p>
                            <p className="data">{bikeUsedValue}</p>
                        </div>
                        <div className="data-field">
                            <p>Average power:</p>
                            <p className="data">{averagePowerValue}</p>
                        </div>
                        <div className="data-field">
                            <p>Max speed:</p>
                            <p className="data">{maxSpeedValue}</p>
                        </div>
                        <div className="data-field">
                            <p>Total distance:</p>
                            <p className="data">{totalDistanceValue}</p>
                        </div>
                        <div className="data-field">
                            <p>Average speed:</p>
                            <p className="data">{averageSpeedValue}</p>
                        </div>
                        <div className="data-field">
                            <p>Elevation gain:</p>
                            <p className="data">{elevationGainValue}</p>
                        </div>
                    </div>
                    {mapGpsPoints.length > 0 && <Map gpsPoints={mapGpsPoints}/>}
                    <p>Rotate to landscape view to expand charts</p>
                    <Chart
                        gpsPoints={chartData.gpsPoints} 
                        totalMass={chartData.totalMass}
                    />
                </div>
            </IonContent>
        </IonPage>
        
    )
}

export default Activity;