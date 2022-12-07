import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { container } from "../../services/InversifyConfig";
import { IStorageService } from "../../services/IStorageService";
import { TYPES } from "../../services/Types";
import Bikes from "../Bikes/Bikes";
import "./Profile.css";

const Profile = () => {
    const { logout } = useAuth0();

    const [isBikesVisible, setIsBikesVisible] = useState<boolean>(false);

    const handleLogout = (event: any) => {
        event.preventDefault();
        logout({ returnTo: process.env.REACT_APP_RETURN_TO_URI });
    }

    const handleViewBikes = (event: any) => {
        event.preventDefault();
        setIsBikesVisible(!isBikesVisible);
    }

    const onViewBikesClose = () => {
        setIsBikesVisible(false);
    }

    return (
        <div className="profile-container">
            <p className="title">
                {`${JSON.parse(localStorage.getItem('user')!).first_name}'s Profile`}
            </p>
            <div className="button-container">
                <button onClick={handleViewBikes}>
                    View bikes
                </button>
                <button onClick={handleLogout}>
                    Logout
                </button>
                
            </div>
            <Bikes 
                visible={isBikesVisible}
                storageService={container.get<IStorageService>(TYPES.IStorageService)}
                onClose={onViewBikesClose}
            />
        </div>
    );
}

export default Profile;