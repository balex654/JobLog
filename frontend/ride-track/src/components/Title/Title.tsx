import { useAuth0 } from "@auth0/auth0-react";

const Title = () => {
    const { loginWithRedirect } = useAuth0();

    const handleLogin = (event: any) => {
        event.preventDefault();
        loginWithRedirect();
    }

    return (
        <div>
            Title page
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Title;