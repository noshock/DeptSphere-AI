import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Repository from "../pages/Repository";
import AdminDashboard from "../pages/AdminDashboard";
import FacultyManagement from "../pages/FacultyManagement";
import Profile from "../pages/Profile";
import AdminDocuments from "../pages/AdminDocuments";
import ProtectedRoute from "../components/ProtectedRoute";
import Upload from "../pages/Upload";
import WriteContent from "../pages/WriteContent";
import SelectImage from "../pages/SelectImage";
import Merge from "../pages/Merge";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<ProtectedRoute role="faculty"> <Dashboard /></ProtectedRoute>}/>
            <Route path="/repository" element={<Repository />} />
            <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"> <AdminDashboard /></ProtectedRoute>}/>
            <Route path="/faculty-management" element={<ProtectedRoute role="admin"> <FacultyManagement /></ProtectedRoute>}/>
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
            <Route path="/admin-documents" element={<ProtectedRoute role="admin"><AdminDocuments /></ProtectedRoute>}/>'
            <Route path="/upload" element={<Upload />} />
            <Route path="/upload/write" element={<WriteContent />}/>
            <Route path="/upload/image" element={<SelectImage />}/>
            <Route path="/upload/merge" element={<Merge />}/>
        </Routes>
    );
};

export default AppRoutes;