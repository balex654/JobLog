import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ConfigureAccount from "./components/ConfigureAccount/ConfigureAccount";
import Dashboard from "./components/Dashboard/Dashboard";
import Title from "./components/Title/Title";
import { IStorageService } from "./services/IStorageService"
import { container } from "./services/InversifyConfig";
import { TYPES } from "./services/Types";
import GuardedRoute, { GuardedRouteProps } from "./common/GuardedRoute";
import { LocalStorageCache, useAuth0 } from "@auth0/auth0-react";
import Profile from "./components/Profile/Profile";
import Activity from "./components/Activity/Activity";
import axios from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";

function App() {
  const { isAuthenticated } = useAuth0();

  const refreshAuth = async (refreshToken: string) => {
    const body = {
      "grant_type": "refresh_token",
      "client_id": "AHsTOUfAHVTFnlwFLHGf7Y0kzeIHmLKF",
      "refresh_token": refreshToken
    }
    const { data } = await axios.post("https://dev-2uer6jn7.us.auth0.com/oauth/token", body);
    return data;
  }

  axios.interceptors.request.use(
    async (config) => {
      const url = config === undefined ? '' : config.url!;
      if (url.includes(process.env.REACT_APP_API_URL!)) {
        const cache = new LocalStorageCache();
        const key = cache.allKeys().find(k => k.includes("auth0spa"));
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
    error => {
      Promise.reject(error)
    });

  const defaultGuardedRouteProps: Omit<GuardedRouteProps, 'outlet'> = {
    canAccess: () => {
      return isAuthenticated
    },
    path: '/'
  };

  return (
    <div className="app">
      <HashRouter>
        <Routes>
          <Route path="/" element={<Title/>}/>
          <Route 
            path="/configure-account" 
            element={<ConfigureAccount storageService={container.get<IStorageService>(TYPES.IStorageService)}/>}
          />
          <Route 
            path="/dashboard" 
            element={<GuardedRoute 
              {...defaultGuardedRouteProps} 
              outlet={<Dashboard/>} 
            />}
          >
            <Route path="activity/:id" element={<Activity storageService={container.get<IStorageService>(TYPES.IStorageService)}/>}/>
            <Route path="profile" element={<Profile/>}/>
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
