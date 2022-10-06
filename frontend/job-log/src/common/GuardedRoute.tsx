import { Navigate } from "react-router-dom";

export type GuardedRouteProps = {
    isAuthenticated: boolean;
    path: string;
    outlet: JSX.Element;
}

export default function GuardedRoute ({isAuthenticated, path, outlet}: GuardedRouteProps) {
    if (isAuthenticated) {
        return outlet;
    }
    else {
        return <Navigate to={{ pathname: path }} />;
    }
}