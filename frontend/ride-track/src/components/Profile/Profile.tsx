import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { container } from "../../services/InversifyConfig";
import { IStorageService } from "../../services/IStorageService";
import { TYPES } from "../../services/Types";
import Bikes from "../Bikes/Bikes";
import EditProfile from "../EditProfile/EditProfile";
import "./Profile.css";

const Profile = () => {
    const { logout } = useAuth0();

    const [isBikesVisible, setIsBikesVisible] = useState<boolean>(false);
    const [isEditProfileVisible, setEditProfileVisible] = useState<boolean>(false);

    const handleLogout = (event: any) => {
        event.preventDefault();
        localStorage.clear();
        logout({ returnTo: process.env.REACT_APP_RETURN_TO_URI });
    }

    const handleViewBikes = (event: any) => {
        setIsBikesVisible(!isBikesVisible);
    }

    const handleEditProfile = (event: any) => {
        setEditProfileVisible(!isEditProfileVisible);
    }

    const onViewBikesClose = () => {
        setIsBikesVisible(false);
    }

    const onEditProfileClose = () => {
        setEditProfileVisible(false);
    }

    return (
        <div className="profile-container">
            <p className="title">
                {`${JSON.parse(localStorage.getItem('user')!).first_name}'s Profile`}
            </p>
            <div className="profile-button-container">
                <button onClick={handleViewBikes}>
                    View bikes
                </button>
                <button onClick={handleEditProfile}>
                    Edit Profile
                </button>
                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
            {
                isBikesVisible &&
                <Bikes 
                    storageService={container.get<IStorageService>(TYPES.IStorageService)}
                    onClose={onViewBikesClose}
                />
            }
            {
                isEditProfileVisible &&
                <EditProfile
                    storageService={container.get<IStorageService>(TYPES.IStorageService)}
                    onClose={onEditProfileClose}
                />
            }
        </div>
    );
}

export default Profile;