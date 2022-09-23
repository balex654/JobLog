import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div>
            Login
            <Link to="/create-account">
                Create Account
            </Link>
        </div>
    );
}

export default Login;