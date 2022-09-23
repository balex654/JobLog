import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CreateAccount from "./components/CreateAccount/CreateAccount";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Login/Login";
import { IStorageService } from "./services/IStorageService"
import { container } from "./services/InversifyConfig";
import { TYPES } from "./services/Types";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route 
            path="/create-account" 
            element={<CreateAccount storageService={container.get<IStorageService>(TYPES.IStorageService)}/>}
          />
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
