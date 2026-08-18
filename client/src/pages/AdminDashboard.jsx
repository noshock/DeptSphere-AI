import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
    const [faculty, setFaculty] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [showProfile, setShowProfile] = useState(false);
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
 },  []);

    return (
    <div className="dashboard">

        {/* Header */}
        <header className="top-header">

            <div className="logo-section">
                <h2>DOCMitra AI</h2>
            </div>

            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search documents, subjects, tags..."
                />
            </div>

            <div className="header-actions">
                <span className="notification-icon">🔔</span>
                <span className="ai-icon">✨</span>

                <div
                    className="profile"
                    onClick={() => setShowProfile(!showProfile)}
                >
                    <span>Welcome ADMIN</span>
                    <span className="profile-avatar">👤</span>
                    <span>▼</span>
                </div>

                {showProfile && (
                    <div className="profile-dropdown">

                        <div className="profile-dropdown-header">
                            <div className="profile-dropdown-avatar">
                                👤
                            </div>

                            <div>
                                <strong>ADMIN</strong>
                                <span>Administrator</span>
                            </div>
                        </div>

                        <Link
                            to="/profile"
                            className="profile-dropdown-item"
                        >
                            👤
                            <div>
                                <strong>My Profile</strong>
                                <span>View your profile</span>
                            </div>
                        </Link>

                        <div className="profile-dropdown-item">
                            🔒
                            <div>
                                <strong>Change Password</strong>
                                <span>Update your password</span>
                            </div>
                        </div>

                        <button
                            className="logout-button"
                            onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("user");
                                window.location.href = "/";
                            }}
                        >
                            Log Out
                        </button>

                    </div>
                )}
            </div>

        </header>


        {/* Sidebar */}
        <aside className="sidebar">

            <nav>

                <Link to="/admin-dashboard">
                    Dashboard
                </Link>

                <Link to="/faculty-management">
                    Faculty Management
                </Link>
                <button className="sidebar-menu-button">
                    <span>AI Assistant</span>
                    <span>›</span>
                </button>

            </nav>

        </aside>


        {/* Main Content */}
        <main className="dashboard-content">

            <h1>Welcome to DOCMitra AI</h1>

            <div className="dashboard-main">

                <section className="dashboard-center">

                    <div className="dashboard-cards">

                        <div className="card">
                            <div className="card-icon">👥</div>

                            <div>
                                <h3>Total Faculty</h3>
                                <p>{faculty.length}</p>
                                <span>Department faculty</span>
                            </div>
                        </div>


                        <div className="card">
                            <div className="card-icon">✅</div>

                            <div>
                                <h3>Active Faculty</h3>
                                <p>
                                    {
                                        faculty.filter(
                                            (member) => member.isActive
                                        ).length
                                    }
                                </p>
                                <span>Currently active</span>
                            </div>
                        </div>


                        <div className="card">
                            <div className="card-icon">⛔</div>

                            <div>
                                <h3>Inactive Faculty</h3>
                                <p>
                                    {
                                        faculty.filter(
                                            (member) => !member.isActive
                                        ).length
                                    }
                                </p>
                                <span>Currently inactive</span>
                            </div>
                        </div>


                        <div className="card">
                            <div className="card-icon">📄</div>

                            <div>
                                <h3>Total Documents</h3>
                                <p>{documents.length}</p>
                                <span>Available in repository</span>
                            </div>
                        </div>

                    </div>


                   <div className="recent-files">
                   
                       <h2>Recent Documents</h2>

                       <Link
                          to="/admin-documents"
                          className="view-all-documents"
                        >
                            view All Documents →
                        </Link>
                   
                       {documents.length === 0 ? (
                           <p>No documents found.</p>
                       ) : (
                           documents.slice(0, 5).map((file) => (
                               <div className="recent-file" key={file._id}>
                   
                                   <h3>{file.title}</h3>
                   
                                   <p>
                                       Subject: {file.subject}
                                   </p>
                   
                                   <p>
                                       Semester: {file.semester}
                                   </p>
                   
                                   <p>
                                       Category: {file.category}
                                   </p>
                   
                                   <p>
                                       Uploaded by:{" "}
                                       <strong>
                                           {file.uploadedBy?.name || "Unknown Faculty"}
                                       </strong>
                                   </p>
                   
                               </div>
                           ))
                       )}
                   
                   </div>

                </section>


                {/* Right Side */}
                <aside className="dashboard-right">

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


                    <div className="reminder-card">

                        <div className="panel-header">
                            <h3>Admin Actions</h3>
                            <span>Manage</span>
                        </div>

                        <div className="reminder-item">

                            <div className="reminder-icon reminder-blue">
                                👥
                            </div>

                            <div>
                                <strong>Faculty Management</strong>
                                <p>
                                    Add and manage faculty accounts
                                </p>
                            </div>

                        </div>


                        <div className="reminder-item">

                            <div className="reminder-icon reminder-orange">
                                📄
                            </div>

                            <div>
                                <strong>Repository</strong>
                                <p>
                                    Manage department documents
                                </p>
                            </div>

                        </div>


                        <div className="reminder-item">

                            <div className="reminder-icon reminder-red">
                                🔐
                            </div>

                            <div>
                                <strong>Access Control</strong>
                                <p>
                                    Manage faculty access
                                </p>
                            </div>

                        </div>

                    </div>


                    <div className="ai-card">

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

                            <button>
                                View Faculty
                            </button>

                            <button>
                                View Documents
                            </button>

                            <button>
                                Manage Department
                            </button>

                        </div>

                    </div>

                </aside>

            </div>

        </main>

    </div>
)};

export default AdminDashboard;