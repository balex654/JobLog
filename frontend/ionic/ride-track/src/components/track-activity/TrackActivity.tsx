import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useState } from "react";
import "./TrackActivity.css";
import { Geolocation } from '@capacitor/geolocation';
import { Stopwatch } from "../../common/Stopwatch";

const TrackActivity = () => {
    const [activityStarted, setActivityStarted] = useState<boolean>(false)
    const [watchId, setWatchId] = useState<string>("");
    const [stopwatch] = useState<Stopwatch>(new Stopwatch);

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
        await watchPosition();
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