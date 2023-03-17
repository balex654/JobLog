import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";
import "./TrackActivity.css";
import { Stopwatch } from "../../common/Stopwatch";
import { DatabaseService } from "../../services/database/DatabaseService";
import { Activity } from "../../model/sqlite/Activity";
import {registerPlugin} from "@capacitor/core";
import { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
import Alert from "../../common/alert/Alert";
import SaveActivityAlert from "./SaveActivityAlert";
import { Storage, Drivers } from "@ionic/storage";
import { getAccessToken } from "../../common/Auth";
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation")

const TrackActivity = () => {
    const [activityStarted, setActivityStarted] = useState<boolean>(false)
    const [watchId, setWatchId] = useState<string>("");
    const [stopwatch] = useState<Stopwatch>(new Stopwatch());
    const [dbService, setDbService] = useState<DatabaseService>(new DatabaseService());
    const [currentActivity, setCurrentActivity] = useState<Activity>(new Activity());
    const [isFirstAlertVisible, setFirstAlertVisible] = useState<boolean>(false);
    const [isSaveActivityVisible, setSaveActivityVisible] = useState<boolean>(false);
    const storage = new Storage({
        name: "storage",
        driverOrder: [Drivers.LocalStorage]
    });
    storage.create();

    useEffect(() => {
        setDbService(new DatabaseService());
    }, []);

    const handleTrackActivity = async () => {
        if (activityStarted) {
            stopActivity();
        }
        else {
            await startActivity();
        }
    }

    const startActivity = async () => {
        stopwatch.reset();
        stopwatch.start();
        setActivityStarted(true);
        const a = new Activity();
        a.startDate = new Date();
        const accessToken = await getAccessToken(storage);
        a.userId = accessToken.sub!;
        const activity = await dbService.AddActivity(a);
        setCurrentActivity(activity);
        await watchPosition(activity);
    }

    const stopActivity = () => {
        setFirstAlertVisible(true);
    }

    const watchPosition = async (activity: Activity) => {
        const id = await BackgroundGeolocation.addWatcher({
            backgroundMessage: "Tracking location in background"
        }, async (position: any, error: any) => {
            console.log(position);
            if (position.speed > 0.3) {
                stopwatch.start();
                await dbService.AddGpsPoint({
                    activityId: activity.id!,
                    altitude: position.altitude,
                    latitude: position.latitude,
                    longitude: position.longitude,
                    speed: position.speed === null ? 0 : position.speed,
                    date: position.time
                });
            }
            else {
                stopwatch.stop();
            }
        });
        setWatchId(id);
    }

    const stopActivityFirstAlert = () => {
        BackgroundGeolocation.removeWatcher({ id: watchId });
        stopwatch.stop();
        currentActivity!.endDate = new Date();
        currentActivity!.movingTime = stopwatch.time;
        setFirstAlertVisible(false);
        setSaveActivityVisible(true);
        setActivityStarted(false);
    }

    const onFirstAlertCancel = () => {
        setFirstAlertVisible(false);
    }

    const saveActivity = async (name: string) => {
        if (name !== "") {
            currentActivity!.name = name;
            await dbService.EditActivity(currentActivity!);
            setSaveActivityVisible(false);
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        Start Activity
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">
                            Start Activity
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div className="track-activity-container">
                    <button onClick={handleTrackActivity} className={activityStarted ? "red-button" : ""}>
                        {activityStarted ? "Stop Activity": "Start Activity"}
                    </button>
                    {
                        isFirstAlertVisible &&
                        <Alert
                            message="Are you sure you want to end the activity?"
                            actionLabel="Yes"
                            actionStyle=""
                            action={stopActivityFirstAlert}
                            onCancel={onFirstAlertCancel}
                        />
                    }
                    {
                        isSaveActivityVisible &&
                        <SaveActivityAlert saveAction={saveActivity}/>
                    }
                </div>
            </IonContent>
        </IonPage>
    )
}

export default TrackActivity;