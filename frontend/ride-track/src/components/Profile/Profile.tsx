import { useAuth0 } from "@auth0/auth0-react";
import "./Profile.css"

const Profile = () => {
    const { logout } = useAuth0();

    const handleLogout = (event: any) => {
        event.preventDefault();
        logout({ returnTo: process.env.REACT_APP_RETURN_TO_URI });
    }

    return (
        <div className="profile-container">
            <p className="title">
                {`${JSON.parse(localStorage.getItem('user')!).first_name}'s Profile`}
            </p>
            <div className="button-container">
                <button>
                    View bikes
                </button>
                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
            
        </div>
    );
}

export default Profile;