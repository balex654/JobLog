import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab3.css';
import { useAuth0 } from "@auth0/auth0-react";
import { Browser } from '@capacitor/browser';

const Tab3: React.FC = () => {
  const { logout } = useAuth0();

  const handleLogoutClick = async () => {
      await logout({
          logoutParams: {
              returnTo: 'com.benalexander.Ride-Track://dev-2uer6jn7.us.auth0.com/capacitor/com.benalexander.Ride-Track/callback'
          },
          async openUrl(url) {
              await Browser.open({
                  url,
                  windowName: "_self"
              })
          }
      });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 3</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 3 page" />
        <button onClick={handleLogoutClick}>Logout</button>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
