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
import jwtDecode, { JwtPayload } from "jwt-decode";
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation")

const TrackActivity = () => {
    const [activityStarted, setActivityStarted] = useState<boolean>(false)
    const [watchId, setWatchId] = useState<string>("");
    const [stopwatch] = useState<Stopwatch>(new Stopwatch);
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

    const handleDelete = async () => {
        await dbService.TestDelete();
    }

    const handleLogData = async () => {
        const data = await dbService.TestGetData();
        data.forEach(d => {
            console.log(data);
        });
    }

    const handleLogActivities = async () => {
        const data = await dbService.TestGetActivities();
        data.forEach(d => {
            console.log(data);
        });
    }

    const startActivity = async () => {
        stopwatch.reset();
        stopwatch.start();
        setActivityStarted(true);
        const accessToken = await storage.get('accessToken');
        const a = new Activity();
        a.startDate = new Date();
        a.userId = jwtDecode<JwtPayload>(accessToken!).sub!;
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
            if (position.speed! > 0.0 || true) {
                console.log(activity);
                stopwatch.start();
                await dbService.AddGpsPoint({
                    activityId: activity.id!,
                    altitude: position.altitude,
                    latitude: position.latitude,
                    longitude: position.longitude,
                    speed: position.speed,
                    date: new Date(position.time)
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
                    <button onClick={handleDelete}>Delete Data</button>
                    <button onClick={handleLogData}>Log data</button>
                    <button onClick={handleLogActivities}>Log activities</button>
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