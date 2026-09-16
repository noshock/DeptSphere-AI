import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const AdminDashboard = () => {
    const [faculty, setFaculty] = useState([]);
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const facultyResponse = await api.get("/faculty/all");
                const repositoryResponse = await api.get("/repository");

                setFaculty(facultyResponse.data);
                setDocuments(repositoryResponse.data);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };

        fetchData();
    }, []);

    const activeFaculty = faculty.filter(
        (member) => member.isActive
    ).length;

    const inactiveFaculty = faculty.filter(
        (member) => !member.isActive
    ).length;

    return (
        <div className="dashboard admin-dashboard">

            {/* Main Dashboard Content */}
            <main className="dashboard-content">

                <div className="dashboard-header">
                    <div>
                        <span className="page-badge">
                            ADMIN DASHBOARD
                        </span>

                        <h1>Welcome to DOCMitra AI</h1>

                        <p>
                            Manage your department, faculty and documents.
                        </p>
                    </div>
                </div>

                <div className="dashboard-main">

                    {/* LEFT / CENTER */}
                    <section className="dashboard-center">

                        {/* TOP CARDS */}
                        <div className="dashboard-cards">

                            <div className="card">
                                <div className="card-icon">
                                    👥
                                </div>

                                <div>
                                    <h3>Total Faculty</h3>
                                    <p>{faculty.length}</p>
                                    <span>
                                        Department faculty
                                    </span>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-icon">
                                    📄
                                </div>

                                <div>
                                    <h3>Total Documents</h3>
                                    <p>{documents.length}</p>
                                    <span>
                                        Available in repository
                                    </span>
                                </div>
                            </div>

                            <div className="card">
                                <div className="card-icon">
                                    ✅
                                </div>

                                <div>
                                    <h3>Active Faculty</h3>
                                    <p>{activeFaculty}</p>
                                    <span>
                                        Currently active
                                    </span>
                                </div>
                            </div>

                        </div>

                        {/* RECENT DOCUMENTS */}
                        <div className="recent-files admin-recent-files">

                            <div className="panel-header">
                                <h2>Recent Documents</h2>

                                <Link
                                    to="/admin-documents"
                                    className="view-all-documents"
                                >
                                    View All →
                                </Link>
                            </div>

                            {documents.length === 0 ? (
                                <div className="empty-state">
                                    <div>📄</div>
                                    <strong>No documents yet</strong>
                                    <p>
                                        Uploaded documents will appear here.
                                    </p>
                                </div>
                            ) : (
                                documents.slice(0, 5).map((file) => (
                                    <div
                                        className="recent-file"
                                        key={file._id}
                                    >
                                        <div className="recent-file-icon">
                                            📄
                                        </div>

                                        <div className="recent-file-info">
                                            <h3>{file.title}</h3>

                                            <p>
                                                {file.subject ||
                                                    "Department document"}
                                            </p>

                                            <span>
                                                Uploaded by{" "}
                                                <strong>
                                                    {file.uploadedBy?.name ||
                                                        "Unknown Faculty"}
                                                </strong>
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}

                        </div>

                    </section>

                    {/* RIGHT SIDE */}
                    <aside className="dashboard-right">

                        {/* CALENDAR */}
                        <div className="calendar-card">

                            <div className="calendar-icon">
                                📅
                            </div>

                            <div className="calendar-info">
                                <h3>
                                    {new Date().toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                </h3>

                                <p>
                                    {new Date().toLocaleDateString(
                                        "en-IN",
                                        {
                                            weekday: "long",
                                        }
                                    )}
                                </p>
                            </div>

                        </div>

                        {/* ADMIN ACTIONS */}
                        <div className="reminder-card admin-actions-card">

                            <div className="panel-header">
                                <h3>Admin Actions</h3>
                            </div>

                            <Link
                                to="/faculty-management"
                                className="reminder-item admin-action-item"
                            >
                                <div className="reminder-icon reminder-blue">
                                    👥
                                </div>

                                <div>
                                    <strong>
                                        Faculty Management
                                    </strong>

                                    <p>
                                        Add and manage faculty accounts
                                    </p>
                                </div>
                            </Link>

                            <Link
                                to="/admin-documents"
                                className="reminder-item admin-action-item"
                            >
                                <div className="reminder-icon reminder-orange">
                                    📄
                                </div>

                                <div>
                                    <strong>
                                        Repository
                                    </strong>

                                    <p>
                                        Manage department documents
                                    </p>
                                </div>
                            </Link>

                        </div>

                        {/* AI ASSISTANT */}
                        <div className="ai-card admin-ai-card">

                            <div className="panel-header">
                                <h3>AI Assistant</h3>

                                <span>New Chat</span>
                            </div>

                            <div className="ai-welcome">

                                <div className="ai-avatar">
                                    ✨
                                </div>

                                <div>
                                    <strong>
                                        Hello, Admin! 👋
                                    </strong>

                                    <p>
                                        Manage your department with
                                        DOCMitra AI.
                                    </p>
                                </div>

                            </div>

                            <div className="ai-suggestions">

                                <button type="button">
                                    View Faculty
                                </button>

                                <button type="button">
                                    View Documents
                                </button>

                                <button type="button">
                                    Department Overview
                                </button>

                            </div>

                        </div>

                    </aside>

                </div>

            </main>

        </div>
    );
};

export default AdminDashboard;