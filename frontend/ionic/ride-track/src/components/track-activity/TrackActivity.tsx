import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";
import "./TrackActivity.css";
import { Geolocation } from '@capacitor/geolocation';
import { Stopwatch } from "../../common/Stopwatch";
import { sqlite } from "../../App";
import { 
    BackgroundGeolocation, 
    BackgroundGeolocationConfig, 
    BackgroundGeolocationEvents,
    BackgroundGeolocationResponse } from "@ionic-native/background-geolocation";
import { DatabaseService } from "../../services/database/DatabaseService";
import { Activity } from "../../model/sqlite/Activity";

const TrackActivity = () => {
    const [activityStarted, setActivityStarted] = useState<boolean>(false)
    const [watchId, setWatchId] = useState<string>("");
    const [stopwatch] = useState<Stopwatch>(new Stopwatch);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [dbService, setDbService] = useState<DatabaseService>(new DatabaseService());
    const [currentActivity, setCurrentActivity] = useState<Activity>();

    useEffect(() => {
        setDbService(new DatabaseService());
    });

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
        setStartDate(new Date());
        setActivityStarted(true);
        const activity = await dbService.AddActivity({
            startDate: startDate
        });
        setCurrentActivity(activity);
        await watchPosition();
        /*const config: BackgroundGeolocationConfig = {
            desiredAccuracy: 1
        }
        BackgroundGeolocation.start();
        BackgroundGeolocation.configure(config).then(() => {
            BackgroundGeolocation.on(BackgroundGeolocationEvents.location)
                .subscribe((location: BackgroundGeolocationResponse) => {
                    console.log(location.altitude);
                    BackgroundGeolocation.finish();
                });
        })*/
    }

    const stopActivity = () => {
        stopwatch.stop();
        setActivityStarted(false);
        Geolocation.clearWatch({
            id: watchId
        });
    }

    const watchPosition = async () => {
        const id = await Geolocation.watchPosition({}, (position, error) => {
            if (position!.coords.speed! > 0.0) {
                stopwatch.start();
                dbService.AddGpsPoint({
                    activityId: currentActivity!.id!,
                    altitude: position!.coords.altitude!,
                    latitude: position!.coords.latitude!,
                    longitude: position!.coords.latitude!,
                    speed: position!.coords.speed!,
                    date: new Date(position!.timestamp)
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
                </div>
            </IonContent>
        </IonPage>
    )
}

export default TrackActivity;