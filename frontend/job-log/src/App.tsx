import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import ConfigureAccount from "./components/ConfigureAccount/ConfigureAccount";
import Dashboard from "./components/Dashboard/Dashboard";
import Title from "./components/Title/Title";
import { IStorageService } from "./services/IStorageService"
import { container } from "./services/InversifyConfig";
import { TYPES } from "./services/Types";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Title/>}/>
          <Route 
            path="/configure-account" 
            element={<ConfigureAccount storageService={container.get<IStorageService>(TYPES.IStorageService)}/>}
          />
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
