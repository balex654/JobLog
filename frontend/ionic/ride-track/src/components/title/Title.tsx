import { IonContent, IonPage } from "@ionic/react";
import "./Title.css";
import { LocalStorageCache, useAuth0 } from "@auth0/auth0-react";
import { Browser } from '@capacitor/browser';
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { HttpStorageService } from "../../services/HttpStorageService";
import { Status } from "../../model/StorageResponse";
import { cacheAuthKey } from "../../common/Auth";
import { Storage, Drivers } from "@ionic/storage";

const Title = () => {
    const { loginWithRedirect, isLoading, isAuthenticated } = useAuth0();
    const history = useHistory();
    
    useEffect(() => {
        const storageService = new HttpStorageService();
        const init = async () => {
            if ((!isLoading && isAuthenticated && !history.location.pathname.includes('tab-view')) || process.env.REACT_APP_ENV === "dev") {
                const response = await storageService.getUserById();
                if (response.status === Status.Ok) {
                    const storage = new Storage({
                        name: "storage",
                        driverOrder: [Drivers.LocalStorage]
                    });
                    storage.create();
                    await storage.set('user', JSON.stringify(response.resource));
                    history.push('/tab-view');
                }
                else if (response.status === Status.NotFound){
                    history.push('/configure-account');
                }
            }
            else {
                const cache = new LocalStorageCache();
                const key = cache.allKeys().find(k => k.includes(cacheAuthKey));
                if (key) {
                    history.push('/tab-view');
                }
            }
        }
        init();
    }, [isAuthenticated, isLoading, history]);

    const handleLoginClick = async () => {
        await loginWithRedirect({
            async openUrl(url) {
                await Browser.open({
                    url,
                    windowName: "_self"
                });
            }
        });
    }

    return (
        <IonPage>
            <IonContent>
                <div className="title-container">
                    <p className="title">Ride Track</p>
                    <button onClick={handleLoginClick}>Login or Create Account</button>
                </div>
            </IonContent>
        </IonPage>
    );
}

export default Title;