import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        if (role && payload.role !== role) {
            if (payload.role === "admin") {
                return <Navigate to="/admin-dashboard" replace />;
            }

            return <Navigate to="/dashboard" replace />;
        }

        return children;

    } catch (error) {
        localStorage.removeItem("token");
        return <Navigate to="/" replace />;
    }
};

export default ProtectedRoute;