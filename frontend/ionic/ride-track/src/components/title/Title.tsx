import { IonContent, IonPage } from "@ionic/react";
import "./Title.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Browser } from '@capacitor/browser';
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const Title = () => {
    const { loginWithRedirect, isLoading, isAuthenticated } = useAuth0();
    const history = useHistory();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            history.push('/ride-track');
        }
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
    )
}

export default Title;