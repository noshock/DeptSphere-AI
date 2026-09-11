import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Header = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [reminders, setReminders] = useState([]);

    const fetchReminders = async () => {
        try {
            const response = await api.get("/reminders");
            setReminders(response.data.reminders || []);
        } catch (error) {
            console.error("Failed to fetch reminders:", error);
        }
    };

    useEffect(() => {
        fetchReminders();
    }, []);

    const unreadCount = reminders.filter(
        (reminder) =>
            reminder.status !== "Completed" &&
            !reminder.isRead
    ).length;

    return (
        <header className="top-header">

            {/* LOGO */}

            <div className="logo-section">
                <h2>DOCMitra AI</h2>
            </div>


            {/* HEADER ACTIONS */}

            <div className="header-actions">

                {/* NOTIFICATIONS */}

                <div
                    className="notification-wrapper"
                    onClick={() =>
                        setShowNotifications(!showNotifications)
                    }
                >
                    <span className="notification-icon">
                        🔔
                    </span>

                    {unreadCount > 0 && (
                        <span className="notification-badge">
                            {unreadCount}
                        </span>
                    )}
                </div>


                {/* AI */}

                <span className="ai-icon">
                    ✨
                </span>


                {/* PROFILE */}

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


                {/* NOTIFICATION DROPDOWN */}

                {showNotifications && (
                    <div className="notification-dropdown">

                        <div className="notification-dropdown-header">
                            <strong>Notifications</strong>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowNotifications(false);
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {reminders.filter(
                            (reminder) =>
                                reminder.status !== "Completed"
                        ).length === 0 ? (
                            <div className="empty-notifications">
                                <div>✓</div>
                                <p>No notifications</p>
                                <span>
                                    You're all caught up.
                                </span>
                            </div>
                        ) : (
                            <div className="notification-list">

                                {reminders
                                    .filter(
                                        (reminder) =>
                                            reminder.status !==
                                            "Completed"
                                    )
                                    .slice(0, 5)
                                    .map((reminder) => (
                                        <div
                                            className={`notification-item ${
                                                !reminder.isRead
                                                    ? "unread"
                                                    : ""
                                            }`}
                                            key={reminder._id}
                                            onClick={async () => {
                                                try {
                                                    await api.put(
                                                        `/reminders/${reminder._id}/read`
                                                    );

                                                    fetchReminders();
                                                } catch (error) {
                                                    console.error(
                                                        "Failed to mark notification as read:",
                                                        error
                                                    );
                                                }
                                            }}
                                        >
                                            <div className="notification-item-icon">
                                                🔔
                                            </div>

                                            <div className="notification-item-content">
                                                <strong>
                                                    {reminder.title}
                                                </strong>

                                                <span>
                                                    Due{" "}
                                                    {new Date(
                                                        reminder.dueDate
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </span>
                                            </div>

                                            {!reminder.isRead && (
                                                <span className="unread-dot"></span>
                                            )}
                                        </div>
                                    ))}

                            </div>
                        )}

                    </div>
                )}


                    {/* PROFILE DROPDOWN */}
                    
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
                                onClick={() => setShowProfile(false)}
                            >
                                👤
                    
                                <div>
                                    <strong>My Profile</strong>
                    
                                    <span>
                                        View your profile
                                    </span>
                                </div>
                            </Link>
                    
                    
                            <Link
                                to="/change-password"
                                className="profile-dropdown-item"
                                onClick={() => setShowProfile(false)}
                            >
                                🔐
                    
                                <div>
                                    <strong>Change Password</strong>
                    
                                    <span>
                                        Update your password
                                    </span>
                                </div>
                            </Link>
                    
                    
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
    );
};

export default Header;