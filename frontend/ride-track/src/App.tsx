import { HashRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ConfigureAccount from "./components/ConfigureAccount/ConfigureAccount";
import Dashboard from "./components/Dashboard/Dashboard";
import Title from "./components/Title/Title";
import { IStorageService } from "./services/IStorageService"
import { container } from "./services/InversifyConfig";
import { TYPES } from "./services/Types";
import GuardedRoute, { GuardedRouteProps } from "./common/GuardedRoute";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "./components/Profile/Profile";
import Activity from "./components/Activity/Activity";
import axios from "axios";
import jwtDecode, { JwtPayload } from "jwt-decode";

function App() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  axios.interceptors.request.use(
    async (config) => {
      const url = config === undefined ? '' : config.url!;
      if (url.includes(process.env.REACT_APP_API_URL!)) {
        let accessToken = localStorage.getItem('accessToken');
        if (accessToken === undefined || accessToken === null || jwtDecode<JwtPayload>(accessToken!).exp! < (Date.now() / 1000)) {
          const newAccessToken = await getAccessTokenSilently({
            audience: "https://ride-track-backend-gol2gz2rwq-uc.a.run.app",
            scope: "read write offline_access"
          });
          localStorage.setItem('accessToken', newAccessToken);
          config.headers!['Authorization'] = `Bearer ${newAccessToken}`;
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
