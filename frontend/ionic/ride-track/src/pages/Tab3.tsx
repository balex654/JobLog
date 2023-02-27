import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useAuth0 } from "@auth0/auth0-react";
import { Browser } from '@capacitor/browser';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Storage, Drivers } from "@ionic/storage";

const Tab3: React.FC = () => {
  const { logout, isLoading, isAuthenticated } = useAuth0();
  const history = useHistory();

  useEffect(() => {
    const storage = new Storage({
      name: "storage",
      driverOrder: [Drivers.LocalStorage]
    });
    storage.create();
    if (!isLoading && !isAuthenticated) {
      storage.clear();
      history.push('/');
    }
  }, [isLoading, isAuthenticated, history])

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
        <button onClick={handleLogoutClick}>Logout</button>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
