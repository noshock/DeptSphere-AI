import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Repository from "../pages/Repository";
import AdminDashboard from "../pages/AdminDashboard";
import FacultyManagement from "../pages/FacultyManagement";
import Profile from "../pages/Profile";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/repository" element={<Repository />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/faculty-management" element={<FacultyManagement />} />
            <Route path="/profile" element={<Profile />} />
        </Routes>
    );
};

export default AppRoutes;