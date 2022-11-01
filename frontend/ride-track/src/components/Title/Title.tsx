import "./Title.css";
import { useAuth0 } from "@auth0/auth0-react";

const Title = () => {
    const { loginWithRedirect } = useAuth0();

    const handleLogin = (event: any) => {
        event.preventDefault();
        loginWithRedirect();
    }

    return (
        <div className="title-page">
            <p className="title">
                Ride Track
            </p>
            <div className="button-container">
                <button 
                    className="login-button" 
                    onClick={handleLogin}>Login or Create Account</button>
            </div>
        </div>
    );
}

export default Title;