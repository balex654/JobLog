import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from "@ionic/react"
import { useState } from "react";
import { Activity } from "../../model/sqlite/Activity";
import { DatabaseService } from "../../services/database/DatabaseService";
import "./UploadActivity.css";
import { Storage, Drivers } from "@ionic/storage";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { GpsPointForm } from "../../model/gps-point/GpsPointForm";
import { ActivityForm } from "../../model/activity/ActivityForm";
import SelectBike from "./select-bike/SelectBike";
import { HttpStorageService } from "../../services/HttpStorageService";
import { BikeResponse } from "../../model/bike/BikeResponse";
import { Status } from "../../model/StorageResponse";

const UploadActivity = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [dbService, setDbService] = useState<DatabaseService>(new DatabaseService());
    const [selectBikeVisible, setSelectBikeVisible] = useState<boolean>(false);
    const [activityToUpload, setActivityToUpload] = useState<Activity>();
    const [storageService] = useState<HttpStorageService>(new HttpStorageService());
    const storage = new Storage({
        name: "storage",
        driverOrder: [Drivers.LocalStorage]
    });
    storage.create();

    useIonViewDidEnter(() => {
        const init = async () => {
            setDbService(new DatabaseService());
            const userId = await getUserId();
            setActivities(await dbService.GetActivitiesForUser(userId));
        }
        
        init(); 
    });

    const getUserId = async () => {
        const accessToken = await storage.get('accessToken');
        return jwtDecode<JwtPayload>(accessToken!).sub!;
    }

    const selectActivity = (activity: Activity) => {
        setActivityToUpload(activity);
        setSelectBikeVisible(true);
    }

    const cancelSelectBike = () => {
        setSelectBikeVisible(false);
    }

    const uploadActivity = async (bike: BikeResponse) => {
        setSelectBikeVisible(false);
        const gpsPoints = await dbService.GetGpsPointsForActivity(activityToUpload!.id!);
        const gpsPointForms: GpsPointForm[] = gpsPoints.map(g => {
            return {
                date: new Date(g.date),
                speed: g.speed,
                latitude: g.latitude,
                longitude: g.longitude,
                altitude: g.altitude
            }
        });
        const userWeight = (await storageService.getUserById()).resource!.weight;
        const activityForm: ActivityForm = {
            name: activityToUpload!.name,
            start_date: activityToUpload!.startDate,
            end_date: activityToUpload!.endDate,
            moving_time: activityToUpload!.movingTime,
            bike_id: bike.id,
            total_mass: userWeight + bike.weight,
            gps_points: gpsPointForms
        }
        const uploadStatus = (await storageService.createActivity(activityForm)).status;
        if (uploadStatus !== Status.Created) {
            alert("Upload Error");
        }
        else {
            alert("Upload Success");
            await dbService.DeleteActivity(activityToUpload!.id!);
            const userId = await getUserId();
            setActivities(await dbService.GetActivitiesForUser(userId));
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        Unsynced Activities
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">
                            Unsynced Activities
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div className="activity-list">
                    {activities.map(a => {
                        return (
                            <div className="activity">
                                <p>{a.name}</p>
                                <p>{a.startDate.toLocaleDateString()}</p>
                                <button onClick={() => selectActivity(a)}>Upload</button>
                            </div>
                        )
                    })}
                    {
                        selectBikeVisible &&
                        <SelectBike
                            storageService={storageService}
                            cancelAction={cancelSelectBike}
                            selectedAction={uploadActivity}
                        />
                    }
                </div>
            </IonContent>
        </IonPage>
    )
}

export default UploadActivity;