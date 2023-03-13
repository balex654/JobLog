import { Route } from 'react-router-dom';
import { LocalStorageCache, useAuth0 } from '@auth0/auth0-react';
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import Title from './components/title/Title';
import { useEffect, useState } from 'react';
import ConfigureAccount from './components/configure-account/ConfigureAccount';
import axios from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { Storage, Drivers } from "@ionic/storage";
import TabView from './components/TabView';
import { useSQLite } from 'react-sqlite-hook';
import { InitDb } from './services/database/InitDb';
import { devAccessToken } from './DevAccessToken';
import { cacheAuthKey } from './common/Auth';

setupIonicReact();

export let sqlite: any;
export let existingConn: any;

const App: React.FC = () => {
  const { handleRedirectCallback } = useAuth0();
  const storage = new Storage({
    name: "storage",
    driverOrder: [Drivers.LocalStorage]
  });
  storage.create();

  const refreshAuth = async (refreshToken: string) => {
    const body = {
      "grant_type": "refresh_token",
      "client_id": "NNEnH1PYbXV0BXONtkQlg4hD30X9uo0r",
      "refresh_token": refreshToken
    }
    const { data } = await axios.post("https://dev-2uer6jn7.us.auth0.com/oauth/token", body);
    return data;
  }

  axios.interceptors.request.use(
    async (config) => {
      const url = config === undefined ? '' : config.url!;
      if (url.includes(process.env.REACT_APP_API_URL!)) {        
        if (process.env.REACT_APP_ENV === "dev") {
          await storage.set('accessToken', devAccessToken);
          config.headers!['Authorization'] = `Bearer ${devAccessToken}`;
          return config;
        }

        const cache = new LocalStorageCache();
        const key = cache.allKeys().find(k => k.includes(cacheAuthKey));
        const authData = cache.get(key!) as any;
        const accessToken = authData.body.access_token;
        if (jwtDecode<JwtPayload>(accessToken!).exp! < (Date.now() / 1000)) {
          const newAuthData = await refreshAuth(authData.body.refresh_token);
          authData.body.access_token = newAuthData.access_token;
          authData.body.refresh_token = newAuthData.refresh_token;
          cache.set(key!, authData);
          config.headers!['Authorization'] = `Bearer ${authData.access_token}`;
          return config;
        }

        config.headers!['Authorization'] = `Bearer ${accessToken}`;
        return config;
      }

      return config;
    },
    async error => {
      throw new Error(error.response);
    }
  );

  const [existConn, setExistConn] = useState(false);
  existingConn = {existConn: existConn, setExistConn: setExistConn};
  const {echo, getPlatform, createConnection, closeConnection,
    retrieveConnection, retrieveAllConnections, closeAllConnections,
    addUpgradeStatement, importFromJson, isJsonValid, copyFromAssets,
    isAvailable} = useSQLite();
  sqlite = {echo: echo, getPlatform: getPlatform,
        createConnection: createConnection,
        closeConnection: closeConnection,
        retrieveConnection: retrieveConnection,
        retrieveAllConnections: retrieveAllConnections,
        closeAllConnections: closeAllConnections,
        addUpgradeStatement: addUpgradeStatement,
        importFromJson: importFromJson,
        isJsonValid: isJsonValid,
        copyFromAssets: copyFromAssets,
        isAvailable:isAvailable};

  useEffect(() => {
    CapApp.addListener('appUrlOpen', async ({ url }) => {
      if ((url.includes('state') && (url.includes('code'))) || url.includes('error')) {
        await handleRedirectCallback(url);
      }

      await Browser.close();
    });

    InitDb();
  }, [handleRedirectCallback]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/" component={Title}/>
          <Route path="/tab-view" component={TabView}/>
          <Route path="/configure-account" component={ConfigureAccount}/>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
};

export default App;
