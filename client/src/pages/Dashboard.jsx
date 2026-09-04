import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Dashboard = () => {
    const [documentCount, setDocumentCount] = useState(0);
    const [recentFiles, setRecentFiles] = useState([]);

    const [showProfile, setShowProfile] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);

    const [activeRepositorySession, setActiveRepositorySession] =
        useState(null);

    const [activeStudentForumSession, setActiveStudentForumSession] =
        useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await api.get("/repository");

                setDocumentCount(response.data.length);
                setRecentFiles(response.data.slice(0, 3));
            } catch (error) {
                console.error("Error fetching documents:", error);
            }
        };

        fetchDocuments();
    }, []);

    return (
        <div className="dashboard">

            {/* ================= HEADER ================= */}

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

                    <span className="notification-icon">
                        🔔
                    </span>

                    <span className="ai-icon">
                        ✨
                    </span>

                    <div
                        className="profile"
                        onClick={() =>
                            setShowProfile(!showProfile)
                        }
                    >
                        <span>Welcome PRAJWAL</span>

                        <span className="profile-avatar">
                            👤
                        </span>

                        <span>▼</span>
                    </div>

                    {showProfile && (
                        <div className="profile-dropdown">

                            <div className="profile-dropdown-header">

                                <div className="profile-dropdown-avatar">
                                    👤
                                </div>

                                <div>
                                    <strong>PRAJWAL</strong>
                                    <span>Faculty</span>
                                </div>

                            </div>

                            <Link
                                to="/profile"
                                className="profile-dropdown-item"
                            >
                                👤

                                <div>
                                    <strong>My Profile</strong>
                                    <span>
                                        View your profile
                                    </span>
                                </div>
                            </Link>

                            <div className="profile-dropdown-item">

                                🔒

                                <div>
                                    <strong>
                                        Change Password
                                    </strong>

                                    <span>
                                        Update your password
                                    </span>
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


            {/* ================= SIDEBAR ================= */}

            <aside className="sidebar">

                <nav>

                    {/* DASHBOARD */}

                    <Link to="/dashboard">
                        Dashboard
                    </Link>


                    {/* ================= REPOSITORY ================= */}

                    <div
                        className="dfile-menu-area"
                        onMouseEnter={() => {
                            setActiveMenu("repository");
                        }}
                        onMouseLeave={() => {
                            setActiveMenu(null);
                            setActiveRepositorySession(null);
                        }}
                    >

                        <button className="sidebar-menu-button">

                            <span>
                                Repository
                            </span>

                            <span>
                                ›
                            </span>

                        </button>


                        {activeMenu === "repository" && (

                            <div className="sidebar-submenu">

                                <h3>
                                    Repository
                                </h3>


                                {/* SESSION */}

                                <div
                                    className="semester-option"
                                    onMouseEnter={() =>
                                        setActiveRepositorySession(
                                            "2026-2027"
                                        )
                                    }
                                >

                                    <span>
                                        Session 2026-2027
                                    </span>

                                    <span>
                                        ›
                                    </span>


                                    {/* EVEN / ODD */}

                                    {activeRepositorySession ===
                                        "2026-2027" && (

                                        <div className="nested-submenu">

                                            <Link
                                                to="/repository?session=2026-2027&term=even"
                                            >
                                                Even
                                            </Link>

                                            <Link
                                                to="/repository?session=2026-2027&term=odd"
                                            >
                                                Odd
                                            </Link>

                                        </div>

                                    )}

                                </div>

                            </div>

                        )}

                    </div>


                    {/* ================= STUDENT FORUM ================= */}

                    <div
                        className="dfile-menu-area"
                        onMouseEnter={() => {
                            setActiveMenu("studentForum");
                        }}
                        onMouseLeave={() => {
                            setActiveMenu(null);
                            setActiveStudentForumSession(null);
                        }}
                    >

                        <button className="sidebar-menu-button">

                            <span>
                                Student Forum
                            </span>

                            <span>
                                ›
                            </span>

                        </button>


                        {activeMenu === "studentForum" && (

                            <div className="sidebar-submenu">

                                <h3>
                                    Student Forum — D.50
                                </h3>


                                {/* SESSION */}

                                <div
                                    className="semester-option"
                                    onMouseEnter={() =>
                                        setActiveStudentForumSession(
                                            "2026-2027"
                                        )
                                    }
                                >

                                    <span>
                                        Session 2026-2027
                                    </span>

                                    <span>
                                        ›
                                    </span>


                                    {/* EVEN / ODD */}

                                    {activeStudentForumSession ===
                                        "2026-2027" && (

                                        <div className="nested-submenu">

                                            <Link
                                                to="/student-forum-ai?session=2026-2027&term=even"
                                            >
                                                Even
                                            </Link>

                                            <Link
                                                to="/student-forum-ai?session=2026-2027&term=odd"
                                            >
                                                Odd
                                            </Link>

                                        </div>

                                    )}

                                </div>

                            </div>

                        )}

                    </div>

                </nav>

            </aside>


            {/* ================= MAIN CONTENT ================= */}

            <main className="dashboard-content">

                <h1>
                    Welcome to DOCMitra AI
                </h1>


                <div className="dashboard-main">

                    {/* CENTER */}

                    <section className="dashboard-center">


                        {/* DASHBOARD CARDS */}

                        <div className="dashboard-cards">


                            {/* TOTAL DOCUMENTS */}

                            <div className="card">

                                <div className="card-icon">
                                    📄
                                </div>

                                <div>

                                    <h3>
                                        Total Documents
                                    </h3>

                                    <p>
                                        {documentCount}
                                    </p>

                                    <span>
                                        Available in repository
                                    </span>

                                </div>

                            </div>


                            {/* RECENT UPLOADS */}

                            <div className="card">

                                <div className="card-icon">
                                    ⬆️
                                </div>

                                <div>

                                    <h3>
                                        Recent Uploads
                                    </h3>

                                    <p>
                                        {recentFiles.length}
                                    </p>

                                    <span>
                                        Latest documents
                                    </span>

                                </div>

                            </div>


                            {/* AI QUERIES */}

                            <div className="card">

                                <div className="card-icon">
                                    ✨
                                </div>

                                <div>

                                    <h3>
                                        AI Queries
                                    </h3>

                                    <p>
                                        0
                                    </p>

                                    <span>
                                        AI interactions
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* RECENT FILES */}

                        <div className="recent-files">

                            <h2>
                                Recent Documents
                            </h2>

                            {recentFiles.length === 0 ? (

                                <p>
                                    No recent uploads.
                                </p>

                            ) : (

                                recentFiles.map((file) => (

                                    <div
                                        className="recent-file"
                                        key={file._id}
                                    >

                                        <h3>
                                            {file.title}
                                        </h3>

                                        <p>
                                            {file.subject}
                                        </p>

                                        <p>
                                            Session {file.session}
                                        </p>

                                        <p>
                                            {file.term}
                                        </p>

                                    </div>

                                ))

                            )}

                        </div>

                    </section>


                    {/* ================= RIGHT SIDE ================= */}

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


                        {/* SMART REMINDERS */}

                        <div className="reminder-card">

                            <div className="panel-header">

                                <h3>
                                    Smart Reminders
                                </h3>

                                <span>
                                    View All
                                </span>

                            </div>


                            <div className="reminder-item">

                                <div className="reminder-icon reminder-red">
                                    📅
                                </div>

                                <div>

                                    <strong>
                                        Upcoming Department Event
                                    </strong>

                                    <p>
                                        Check event details and schedule
                                    </p>

                                </div>

                            </div>


                            <div className="reminder-item">

                                <div className="reminder-icon reminder-orange">
                                    ⚠️
                                </div>

                                <div>

                                    <strong>
                                        Document Reminder
                                    </strong>

                                    <p>
                                        Important document needs attention
                                    </p>

                                </div>

                            </div>


                            <div className="reminder-item">

                                <div className="reminder-icon reminder-blue">
                                    ℹ️
                                </div>

                                <div>

                                    <strong>
                                        Department Notice
                                    </strong>

                                    <p>
                                        New information is available
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* AI CARD */}

                        <div className="ai-card">

                            <div className="panel-header">

                                <h3>
                                    AI Assistant
                                </h3>

                                <span>
                                    New Chat
                                </span>

                            </div>

                            <div className="ai-welcome">

                                <div className="ai-avatar">
                                    ✨
                                </div>

                                <div>

                                    <strong>
                                        Hello, Prajwal! 👋
                                    </strong>

                                    <p>
                                        Ask me anything about your
                                        department documents.
                                    </p>

                                </div>

                            </div>

                            <div className="ai-suggestions">

                                <button>
                                    Summarize a document
                                </button>

                                <button>
                                    Find important topics
                                </button>

                                <button>
                                    Generate questions
                                </button>

                            </div>

                        </div>

                    </aside>

                </div>

            </main>

        </div>
    );
};

export default Dashboard;