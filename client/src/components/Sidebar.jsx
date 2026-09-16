import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const Sidebar = () => {
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeRepositorySession, setActiveRepositorySession] =
        useState(null);
    const [activeStudentForumSession, setActiveStudentForumSession] =
        useState(null);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = user.role === "admin";

    return (
        <aside className="sidebar">
            <nav>

                {/* ================= DASHBOARD ================= */}

                <NavLink
                    to={isAdmin ? "/admin-dashboard" : "/dashboard"}
                    className={({ isActive }) =>
                        isActive ? "sidebar-active" : ""
                    }
                >
                    Dashboard
                </NavLink>


                {/* ================= ADMIN ================= */}

                {isAdmin && (
                    <NavLink
                        to="/faculty-management"
                        className={({ isActive }) =>
                            isActive ? "sidebar-active" : ""
                        }
                    >
                        Faculty Management
                    </NavLink>
                )}


                {/* ================= FACULTY ================= */}

                {!isAdmin && (
                    <>
                        {/* REPOSITORY */}

                        <div
                            className="dfile-menu-area"
                            onMouseEnter={() =>
                                setActiveMenu("repository")
                            }
                            onMouseLeave={() => {
                                setActiveMenu(null);
                                setActiveRepositorySession(null);
                            }}
                        >
                            <button
                                type="button"
                                className={`sidebar-menu-button ${
                                    window.location.pathname ===
                                    "/repository"
                                        ? "sidebar-active-menu"
                                        : ""
                                }`}
                            >
                                <span>Repository</span>
                                <span>›</span>
                            </button>

                            {activeMenu === "repository" && (
                                <div className="sidebar-submenu">

                                    <h3>Repository</h3>

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

                                        <span>›</span>

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


                        {/* STUDENT FORUM */}

                        <div
                            className="dfile-menu-area"
                            onMouseEnter={() =>
                                setActiveMenu("studentForum")
                            }
                            onMouseLeave={() => {
                                setActiveMenu(null);
                                setActiveStudentForumSession(null);
                            }}
                        >
                            <button
                                type="button"
                                className={`sidebar-menu-button ${
                                    window.location.pathname.startsWith(
                                        "/student-forum-ai"
                                    )
                                        ? "sidebar-active-menu"
                                        : ""
                                }`}
                            >
                                <span>Student Forum</span>
                                <span>›</span>
                            </button>

                            {activeMenu === "studentForum" && (
                                <div className="sidebar-submenu">

                                    <h3>
                                        Student Forum — D.50
                                    </h3>

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

                                        <span>›</span>

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
                    </>
                )}

            </nav>
        </aside>
    );
};

export default Sidebar;