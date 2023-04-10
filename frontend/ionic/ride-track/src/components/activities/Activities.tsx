import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from "@ionic/react";
import "./Activities.css";
import { HttpStorageService } from "../../services/HttpStorageService";
import { useState } from "react";
import { ActivityResponse } from "../../model/activity/ActivityResponse";
import { useHistory } from "react-router";

const Activities = () => {
    const history = useHistory();
    const [storageService] = useState<HttpStorageService>(new HttpStorageService());
    const [activities, setActivities] = useState<ActivityResponse[]>([]);

    useIonViewDidEnter(() => {
        const getActivities = async () => {
            const response = await storageService.getActivities();
            setActivities(response.resource!.activities);
        }

        getActivities();
    }, [storageService]);

    const handleActivityClick = (id: number) => {
        history.push(`/tab-view/activity/${id}`);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        Activities
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">
                            Activities
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div className="webapp-link">
                    <p className="text">
                        Go to <a href="https://tinyurl.com/ridetrack">https://tinyurl.com/ridetrack</a> on a desktop to view more detailed analysis
                    </p>
                </div>
                <div className="activity-list">
                    {activities.map(a => {
                        return (
                            <button onClick={() => handleActivityClick(a.id)} className="activity activity-button">
                                <p>{a.name}</p>
                                <p>{(new Date(a.start_date)).toLocaleDateString()}</p>
                            </button>
                        )
                    })}
                </div>
            </IonContent>
        </IonPage>
    );
}

export default Activities;