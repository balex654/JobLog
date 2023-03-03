import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";
import "./TrackActivity.css";
import { Stopwatch } from "../../common/Stopwatch";
import { DatabaseService } from "../../services/database/DatabaseService";
import { Activity } from "../../model/sqlite/Activity";
import {registerPlugin} from "@capacitor/core";
import { BackgroundGeolocationPlugin } from "@capacitor-community/background-geolocation";
const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation")

const TrackActivity = () => {
    const [activityStarted, setActivityStarted] = useState<boolean>(false)
    const [watchId, setWatchId] = useState<string>("");
    const [stopwatch] = useState<Stopwatch>(new Stopwatch);
    const [dbService, setDbService] = useState<DatabaseService>(new DatabaseService());
    const [currentActivity, setCurrentActivity] = useState<Activity>();

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
        const a = new Activity();
        a.startDate = new Date();
        const activity = await dbService.AddActivity(a);
        setCurrentActivity(activity);
        await watchPosition(activity);
    }

    const stopActivity = () => {
        stopwatch.stop();
        setActivityStarted(false);
        BackgroundGeolocation.removeWatcher({ id: watchId });
    }

    const watchPosition = async (activity: Activity) => {
        const id = await BackgroundGeolocation.addWatcher({}, async (position: any, error: any) => {
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
                </div>
            </IonContent>
        </IonPage>
    )
}

export default TrackActivity;