import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../stores/store";

export default function RequireAuth() {
    const { userStore: { isLoggedIn } } = useStore();
    const location = useLocation();
    if (!isLoggedIn) {
        return <Navigate replace to='/login' state={{ from: location.pathname }} />

    }
    return <Outlet />
}