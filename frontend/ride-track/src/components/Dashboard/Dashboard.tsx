import "./Dashboard.css";
import Sidebar from "../Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { container } from "../../services/InversifyConfig";
import { IStorageService } from "../../services/IStorageService";
import { TYPES } from "../../services/Types";

const Dashboard = () => {

    return (
        <div className="dashboard-container">
            <Sidebar storageService={container.get<IStorageService>(TYPES.IStorageService)}></Sidebar>
            <Outlet/>
        </div>
    );
}

export default Dashboard;