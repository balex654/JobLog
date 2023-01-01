import { Navigate } from "react-router-dom";

export type GuardedRouteProps = {
    canAccess: Function;
    path: string;
    outlet: JSX.Element;
}

export default function GuardedRoute ({canAccess, path, outlet}: GuardedRouteProps) {
    if (canAccess) {
        return outlet;
    }
    else {
        return <Navigate to={{ pathname: path }} />;
    }
}