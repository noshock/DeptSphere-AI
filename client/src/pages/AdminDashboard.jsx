import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import api from "../services/api";

const AdminDashboard = () => {
    const [faculty, setFaculty] = useState([]);
    const [documents, setDocuments] = useState([]);

    const [aiMessages, setAiMessages] = useState([]);
    const [aiInput, setAiInput] = useState("");

const sendAdminAIMessageWithText = async (message) => {
    const previousInput = aiInput;

    setAiInput(message);

    setTimeout(() => {
        setAiInput(previousInput);
    }, 0);

    const text = message.trim();

    if (!text) return;

    setAiMessages((prev) => [
        ...prev,
        {
            role: "user",
            content: text,
        },
    ]);

    try {
        const facultyDocumentSummary = {};

        documents.forEach((doc) => {
            const facultyName =
                doc.uploadedBy?.name || "Unknown Faculty";

            if (!facultyDocumentSummary[facultyName]) {
                facultyDocumentSummary[facultyName] = 0;
            }

            facultyDocumentSummary[facultyName]++;
        });

        const context = {
            totalFaculty: faculty.length,
            activeFaculty,
            inactiveFaculty,
            totalDocuments: documents.length,
            facultyDocumentSummary,
            recentDocuments: documents.slice(0, 5).map((doc) => ({
                title: doc.title,
                subject: doc.subject,
                uploadedBy:
                    doc.uploadedBy?.name || "Unknown Faculty",
            })),
        };

        const response = await api.post("/admin-ai/chat", {
            message: text,
            context,
        });

        setAiMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                content: response.data.reply,
            },
        ]);
    } catch (error) {
        console.error("Admin AI error:", error);

        setAiMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                content:
                    "Sorry, I couldn't process your request right now.",
            },
        ]);
    }
};

const sendAdminAIMessage = async () => {
    const text = aiInput.trim();

    if (!text) return;

    setAiMessages((prev) => [
        ...prev,
        {
            role: "user",
            content: text,
        },
    ]);

    setAiInput("");

    try {
       const facultyDocumentSummary = {};

        documents.forEach((doc) => {
            const facultyName = doc.uploadedBy?.name || "Unknown Faculty";
        
            if (!facultyDocumentSummary[facultyName]) {
                facultyDocumentSummary[facultyName] = 0;
            }
        
            facultyDocumentSummary[facultyName]++;
        });
        
        const context = {
            totalFaculty: faculty.length,
            activeFaculty,
            inactiveFaculty,
            totalDocuments: documents.length,
        
            facultyDocumentSummary,
        
            recentDocuments: documents.slice(0, 5).map((doc) => ({
                title: doc.title,
                subject: doc.subject,
                uploadedBy: doc.uploadedBy?.name || "Unknown Faculty",
            })),
        };

        const response = await api.post("/admin-ai/chat", {
            message: text,
            context,
        });

        setAiMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                content: response.data.reply,
            },
        ]);
    } catch (error) {
        console.error("Admin AI error:", error);

        setAiMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                content:
                    "Sorry, I couldn't process your request right now.",
            },
        ]);
    }
};

    // Calendar
    const [showCalendar, setShowCalendar] = useState(false);
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const facultyResponse = await api.get("/faculty/all");
                const repositoryResponse = await api.get("/repository");

                const facultyOnly = facultyResponse.data.filter(
                    (member) => member.role === "faculty"
                );

                setFaculty(facultyOnly);
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
            <main className="dashboard-content">

                {/* HEADER */}
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

                    {/* LEFT SIDE */}
                    <section className="dashboard-center">

                        {/* DASHBOARD CARDS */}
                        <div className="dashboard-cards">

                            {/* TOTAL FACULTY */}
                            <Link
                                to="/faculty-management"
                                className="dashboard-card-link"
                            >
                                <div className="card">
                                    <div className="card-icon">
                                        👥
                                    </div>

                                    <div>
                                        <h3>Total Faculty</h3>

                                        <p>
                                            {faculty.length}
                                        </p>

                                        <span>
                                            Department faculty
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            {/* TOTAL DOCUMENTS */}
                            <Link
                                to="/admin-documents"
                                className="dashboard-card-link"
                            >
                                <div className="card">
                                    <div className="card-icon">
                                        📄
                                    </div>

                                    <div>
                                        <h3>Total Documents</h3>

                                        <p>
                                            {documents.length}
                                        </p>

                                        <span>
                                            Available in repository
                                        </span>
                                    </div>
                                </div>
                            </Link>

                            {/* ACTIVE FACULTY */}
                            <Link
                                to="/faculty-management"
                                className="dashboard-card-link"
                            >
                                <div className="card">
                                    <div className="card-icon">
                                        ✅
                                    </div>

                                    <div>
                                        <h3>Active Faculty</h3>

                                        <p>
                                            {activeFaculty}
                                        </p>

                                        <span>
                                            Currently active
                                        </span>
                                    </div>
                                </div>
                            </Link>

                        </div>

                        {/* RECENT DOCUMENTS */}
                        <div className="recent-files admin-recent-files">

                            <div className="panel-header">

                                <h2>
                                    Recent Documents
                                </h2>

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

                                    <strong>
                                        No documents yet
                                    </strong>

                                    <p>
                                        Uploaded documents will appear here.
                                    </p>

                                </div>
                            ) : (
                                documents
                                    .slice(0, 5)
                                    .map((file) => (
                                        <div
                                            className="recent-file"
                                            key={file._id}
                                        >

                                            <div className="recent-file-icon">
                                                📄
                                            </div>

                                            <div className="recent-file-info">

                                                <h3>
                                                    {file.title}
                                                </h3>

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

                        {/* CALENDAR CARD */}
                        <div
                            className="calendar-card-link"
                            onClick={() =>
                                setShowCalendar(true)
                            }
                            style={{
                                cursor: "pointer",
                            }}
                        >
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
                        </div>

                        {/* AI ASSISTANT */}
                        <div className="ai-card admin-ai-card">

                            <div className="panel-header">

                                <h3>
                                    AI Assistant
                                </h3>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setAiMessages([]);
                                        setAiInput("");
                                    }}
                                >
                                    ↻ New Chat
                                </button>

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

                            {aiMessages.length > 0 && (
                                <div className="ai-chat-messages">
                            
                                    {aiMessages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`ai-message ${
                                                message.role === "user"
                                                    ? "ai-message-user"
                                                    : "ai-message-ai"
                                            }`}
                                        >
                                         <ReactMarkdown>
                                            {message.content}
                                         </ReactMarkdown>
                                        </div>
                                    ))}
                            
                                </div>
                            )}

                            {aiMessages.length === 0 && (
                                <div className="ai-suggestions">
                            
                                    <button
                                        type="button"
                                        onClick={() =>
                                            sendAdminAIMessageWithText(
                                                "How many documents are available in the repository?"
                                            )
                                        }
                                    >
                                        📄 Document count
                                    </button>
                            
                                    <button
                                        type="button"
                                        onClick={() =>
                                            sendAdminAIMessageWithText(
                                                "What can you help me with?"
                                            )
                                        }
                                    >
                                        ✨ What can you do?
                                    </button>
                            
                                    <button
                                        type="button"
                                        onClick={() =>
                                            sendAdminAIMessageWithText(
                                                "Explain the DOCMitra admin dashboard"
                                            )
                                        }
                                    >
                                        ❓ Explain dashboard
                                    </button>
                            
                                </div>
                            )}

                            <div className="ai-chat-input">
                            
                                <input
                                    type="text"
                                    value={aiInput}
                                    onChange={(e) => setAiInput(e.target.value)}
                                    placeholder="Ask Admin AI anything..."
                                />
                            
                               <button
                                    type="button"
                                    onClick={sendAdminAIMessage}
                                >
                                    ➤
                                </button>
                            
                            </div>

                        </div>

                    </aside>

                </div>

            </main>

            {/* CALENDAR MODAL */}
            {showCalendar && (
                <div className="calendar-modal-overlay">

                    <div className="calendar-modal">

                        {/* MODAL HEADER */}
                        <div className="calendar-modal-header">

                            <h2>
                                Calendar
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCalendar(false)
                                }
                            >
                                ✕
                            </button>

                        </div>

                        {/* CALENDAR BODY */}
                        <div className="calendar-modal-body">

                            {/* MONTH NAVIGATION */}
                            <div className="calendar-month-header">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setCalendarDate(
                                            new Date(
                                                calendarDate.getFullYear(),
                                                calendarDate.getMonth() - 1,
                                                1
                                            )
                                        )
                                    }
                                >
                                    ‹
                                </button>

                                <h3>
                                    {calendarDate.toLocaleDateString(
                                        "en-IN",
                                        {
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )}
                                </h3>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setCalendarDate(
                                            new Date(
                                                calendarDate.getFullYear(),
                                                calendarDate.getMonth() + 1,
                                                1
                                            )
                                        )
                                    }
                                >
                                    ›
                                </button>

                            </div>

                            {/* WEEKDAYS */}
                            <div className="calendar-weekdays">

                                {[
                                    "Sun",
                                    "Mon",
                                    "Tue",
                                    "Wed",
                                    "Thu",
                                    "Fri",
                                    "Sat",
                                ].map((day) => (
                                    <div key={day}>
                                        {day}
                                    </div>
                                ))}

                            </div>

                            {/* CALENDAR DAYS */}
                            <div className="calendar-days">

                                {/* EMPTY DAYS BEFORE FIRST DAY */}
                                {Array.from(
                                    {
                                        length: new Date(
                                            calendarDate.getFullYear(),
                                            calendarDate.getMonth(),
                                            1
                                        ).getDay(),
                                    },
                                    (_, index) => (
                                        <div
                                            key={`empty-${index}`}
                                            className="calendar-day empty"
                                        ></div>
                                    )
                                )}

                                {/* ACTUAL DAYS */}
                                {Array.from(
                                    {
                                        length: new Date(
                                            calendarDate.getFullYear(),
                                            calendarDate.getMonth() + 1,
                                            0
                                        ).getDate(),
                                    },
                                    (_, index) => {

                                        const day = index + 1;

                                        const isSelected =
                                            selectedDate &&
                                            selectedDate.getDate() === day &&
                                            selectedDate.getMonth() ===
                                                calendarDate.getMonth() &&
                                            selectedDate.getFullYear() ===
                                                calendarDate.getFullYear();

                                        return (
                                            <button
                                                type="button"
                                                key={day}
                                                className={`calendar-day ${
                                                    isSelected
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setSelectedDate(
                                                        new Date(
                                                            calendarDate.getFullYear(),
                                                            calendarDate.getMonth(),
                                                            day
                                                        )
                                                    )
                                                }
                                            >
                                                {day}
                                            </button>
                                        );
                                    }
                                )}

                            </div>

                            {/* SELECTED DATE */}
                            {selectedDate && (
                                <div className="selected-date-info">

                                    <strong>
                                        Selected Date
                                    </strong>

                                    <p>
                                        {selectedDate.toLocaleDateString(
                                            "en-IN",
                                            {
                                                weekday: "long",
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}
                                    </p>

                                </div>
                            )}

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default AdminDashboard;