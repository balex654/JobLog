import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from "@ionic/react"
import { useEffect, useState } from "react";
import { Activity } from "../../model/sqlite/Activity";
import { DatabaseService } from "../../services/database/DatabaseService";
import "./UploadActivity.css";
import { Storage, Drivers } from "@ionic/storage";
import jwtDecode, { JwtPayload } from "jwt-decode";

const UploadActivity = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [dbService, setDbService] = useState<DatabaseService>(new DatabaseService());
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
                                <button>Upload</button>
                            </div>
                        )
                    })}
                </div>
            </IonContent>
        </IonPage>
    )
}

export default UploadActivity;