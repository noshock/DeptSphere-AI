import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Repository from "../pages/Repository";
import AdminDashboard from "../pages/AdminDashboard";
import FacultyManagement from "../pages/FacultyManagement";
import Profile from "../pages/Profile";
import ChangePassword from "../pages/ChangePassword";
import AdminDocuments from "../pages/AdminDocuments";

import ProtectedRoute from "../components/ProtectedRoute";
import AppLayout from "../components/AppLayout";

import Upload from "../pages/Upload";
import WriteContent from "../pages/WriteContent";
import SelectImage from "../pages/SelectImage";
import Merge from "../pages/Merge";

import StudentForumAI from "../pages/StudentForumAI";
import StudentForumAICreate from "../pages/StudentForumAICreate";
import StudentForumAIPreview from "../pages/StudentForumAIPreview";
import StudentForumAIUpload from "../pages/StudentForumAIUpload";
import StudentForumAIEditUpload from "../pages/StudentForumAIEditUpload";
import ForgotPassword from "../pages/ForgotPassword";

const AppRoutes = () => {
    return (
        <Routes>

            {/* ================= LOGIN ================= */}

            <Route
                path="/"
                element={<Login />}
            />

            <Route
             path="/forgot-password"
             element={<ForgotPassword />}
            />


            {/* ================= FACULTY DASHBOARD ================= */}

            <Route
                path="/dashboard"
                element={
                    <AppLayout>
                        <ProtectedRoute role="faculty">
                            <Dashboard />
                        </ProtectedRoute>
                    </AppLayout>
                }
            />


            {/* ================= REPOSITORY ================= */}

            <Route
                path="/repository"
                element={
                    <AppLayout>
                        <Repository />
                    </AppLayout>
                }
            />


            {/* ================= PROFILE ================= */}

            <Route
                path="/profile"
                element={
                    <AppLayout>
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    </AppLayout>
                }
            />
            <Route
                path="/change-password"
                element={
                    <AppLayout>
                        <ProtectedRoute>
                            <ChangePassword />
                        </ProtectedRoute>
                    </AppLayout>
                }
            />


            {/* ================= STUDENT FORUM ================= */}

            <Route
                path="/student-forum-ai"
                element={
                    <AppLayout>
                        <StudentForumAI />
                    </AppLayout>
                }
            />

            <Route
                path="/student-forum-ai/create"
                element={
                    <AppLayout>
                        <StudentForumAICreate />
                    </AppLayout>
                }
            />

            <Route
                path="/student-forum-ai/upload"
                element={
                    <AppLayout>
                        <StudentForumAIUpload />
                    </AppLayout>
                }
            />

            <Route
                path="/student-forum-ai/edit-upload"
                element={
                    <AppLayout>
                        <StudentForumAIEditUpload />
                    </AppLayout>
                }
            />

            <Route
                path="/student-forum-ai/preview"
                element={
                    <AppLayout>
                        <StudentForumAIPreview />
                    </AppLayout>
                }
            />


            {/* ================= UPLOAD ================= */}

            <Route
                path="/upload"
                element={
                    <AppLayout>
                        <Upload />
                    </AppLayout>
                }
            />

            <Route
                path="/upload/write"
                element={
                    <AppLayout>
                        <WriteContent />
                    </AppLayout>
                }
            />

            <Route
                path="/upload/image"
                element={
                    <AppLayout>
                        <SelectImage />
                    </AppLayout>
                }
            />

            <Route
                path="/upload/merge"
                element={
                    <AppLayout>
                        <Merge />
                    </AppLayout>
                }
            />


            {/* ================= ADMIN ================= */}

            <Route
                path="/admin-dashboard"
                element={
                    <ProtectedRoute role="admin">
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/faculty-management"
                element={
                    <ProtectedRoute role="admin">
                        <FacultyManagement />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin-documents"
                element={
                    <ProtectedRoute role="admin">
                        <AdminDocuments />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
};

export default AppRoutes;