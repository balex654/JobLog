import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from "@ionic/react";
import "./Activities.css";
import { HttpStorageService } from "../../services/HttpStorageService";
import { useState } from "react";
import { ActivityResponse } from "../../model/activity/ActivityResponse";

const Activities = () => {
    const [storageService] = useState<HttpStorageService>(new HttpStorageService());
    const [activities, setActivities] = useState<ActivityResponse[]>([]);

    useIonViewDidEnter(() => {
        const getActivities = async () => {
            const response = await storageService.getActivities();
            setActivities(response.resource!.activities);
        }

        getActivities();
    }, [storageService])

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
                <div className="activity-list">
                    {activities.map(a => {
                        return (
                            <a className="activity activity-link">
                                <p>{a.name}</p>
                                <p>{(new Date(a.start_date)).toLocaleDateString()}</p>
                            </a>
                        )
                    })}
                </div>
            </IonContent>
        </IonPage>
    );
}

export default Activities;