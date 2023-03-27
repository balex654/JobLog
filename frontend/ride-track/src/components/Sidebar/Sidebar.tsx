import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ActivityResponse } from "../../model/activity/ActivityResponse";
import { IStorageService } from "../../services/IStorageService";
import "./Sidebar.css";

interface SidebarProps {
    storageService: IStorageService;
}

const Sidebar = ({storageService}: SidebarProps) => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState<ActivityResponse[]>([]);

    useEffect(() => {
        const getActivities = async () => {
            const response = await storageService.getActivities();
            setActivities(response.resource!.activities);
        }

        getActivities();
    }, [storageService]);

    const handleActivityClick = (activityId: number) => {
        navigate(`/dashboard/activity/${activityId.toString()}`)
    }

    return (
        <div className="sidebar-container">
            <a className="profile-link" href="/#/dashboard/profile">Ride Track</a>
            <p className="activities-label">Activities</p>
            <div className="activity-list">
                {activities.map(a => <button onClick={() => handleActivityClick(a.id)} className="activity-list-item">{a.name} <br></br> 
                    {new Date(a.start_date).toLocaleDateString()}</button>)}
            </div>
        </div>
    );
}

export default Sidebar;