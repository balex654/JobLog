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

function App() {
  const { isAuthenticated } = useAuth0();

  const defaultGuardedRouteProps: Omit<GuardedRouteProps, 'outlet'> = {
    isAuthenticated: isAuthenticated,
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
            <Route path="activity" element={<Activity/>}/>
            <Route path="profile" element={<Profile/>}/>
          </Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
