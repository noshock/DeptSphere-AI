import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import api from "../services/api";

const Dashboard = () => {
    const [documentCount, setDocumentCount] = useState(0);
    const [recentFiles, setRecentFiles] = useState([]);

    const [activeMenu, setActiveMenu] = useState(null);

    const [activeRepositorySession, setActiveRepositorySession] =
        useState(null);

    const [activeStudentForumSession, setActiveStudentForumSession] =
        useState(null);

    const [reminders, setReminders] = useState([]);
    const [showReminderForm, setShowReminderForm] = useState(false);
    const [reminderTitle, setReminderTitle] = useState("");
    const [reminderDescription, setReminderDescription] = useState("");
    const [reminderDate, setReminderDate] = useState("");
    const [reminderPriority, setReminderPriority] = useState("Medium");

    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [calendarMonth, setCalendarMonth] = useState(new Date());

    // ================= AI ASSISTANT =================

    const [aiMessages, setAiMessages] = useState([]);
    const [aiInput, setAiInput] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

    const sendAIMessage = async (message = aiInput) => {
        const text = message.trim();

        if (!text || aiLoading) return;

        setAiMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: text,
            },
        ]);

        setAiInput("");
        setAiLoading(true);

        try {
            const context = `
Dashboard Information:
Total Documents: ${documentCount}

Recent Repository Documents:
${recentFiles
    .map(
        (file) =>
            `- ${
                file.name ||
                file.originalName ||
                file.filename ||
                "Unnamed document"
            }`
    )
    .join("\n")}

The user is currently using the DOCMitra AI Dashboard.
`;

            const response = await api.post("/ai/chat", {
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
            console.error("AI Assistant error:", error);

            setAiMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, I couldn't process your request right now. Please try again.",
                },
            ]);
        } finally {
            setAiLoading(false);
        }
    };

    // ================= REMINDERS =================

    const fetchReminders = async () => {
        try {
            const response = await api.get("/reminders");
            setReminders(response.data.reminders || []);
        } catch (error) {
            console.error("Failed to fetch reminders:", error);
        }
    };

    // ================= INITIAL DATA =================

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
        fetchReminders();
    }, []);

    // ================= CALENDAR =================

    const getDaysInMonth = (date) => {
        return new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0
        ).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const day = new Date(
            date.getFullYear(),
            date.getMonth(),
            1
        ).getDay();

        return day === 0 ? 6 : day - 1;
    };

    const isSameDate = (date1, date2) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    const hasReminderOnDate = (day) => {
        return reminders.some((reminder) => {
            if (reminder.status === "Completed") return false;

            const reminderDate = new Date(reminder.dueDate);

            return (
                reminderDate.getFullYear() === calendarMonth.getFullYear() &&
                reminderDate.getMonth() === calendarMonth.getMonth() &&
                reminderDate.getDate() === day
            );
        });
    };

    const selectedDateReminders = reminders.filter((reminder) => {
        if (reminder.status === "Completed") return false;

        return isSameDate(
            new Date(reminder.dueDate),
            selectedDate
        );
    });

    // ================= RENDER =================

    return (
        <div className="dashboard">

            {/* ================= MAIN CONTENT ================= */}

            <main className="dashboard-content">

                <h1>
                    Welcome to DOCMitra AI
                </h1>

                <div className="dashboard-main">

                    {/* ================= LEFT / CENTER AREA ================= */}

                    <section className="dashboard-center">

                        {/* ================= DASHBOARD CARDS ================= */}

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


                            {/* CALENDAR */}

                            <div
                                className="calendar-card"
                                onClick={() => setShowCalendar(true)}
                            >

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


                        {/* ================= SMART REMINDERS ================= */}

                        <div className="dashboard-reminder-wrapper">

                            <div className="reminder-card">

                                <div className="reminder-header">

                                    <div>
                                        <h3>
                                            Smart Reminders
                                        </h3>

                                        <span>
                                            Never miss an important date
                                        </span>
                                    </div>

                                </div>

                                <button
                                    className="add-reminder-button"
                                    onClick={() =>
                                        setShowReminderForm(true)
                                    }
                                >
                                    + Add Reminder
                                </button>


                                {reminders.filter(
                                    (reminder) =>
                                        reminder.status !== "Completed"
                                ).length === 0 ? (

                                    <div className="no-reminders">

                                        <div className="no-reminders-icon">
                                            ✓
                                        </div>

                                        <p>
                                            No upcoming reminders
                                        </p>

                                        <span>
                                            You're all caught up.
                                        </span>

                                    </div>

                                ) : (

                                    <div className="reminder-list">

                                        {reminders
                                            .filter(
                                                (reminder) =>
                                                    reminder.status !==
                                                    "Completed"
                                            )
                                            .slice(0, 3)
                                            .map((reminder) => (

                                                <div
                                                    className={`reminder-item ${reminder.priority?.toLowerCase()}`}
                                                    key={reminder._id}
                                                >

                                                    <div className="reminder-dot"></div>

                                                    <div className="reminder-content">

                                                        <strong>
                                                            {reminder.title}
                                                        </strong>

                                                        <span>
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


                                                    <button
                                                        type="button"
                                                        className="delete-reminder-button"
                                                        onClick={async (e) => {

                                                            e.stopPropagation();

                                                            if (
                                                                !window.confirm(
                                                                    "Delete this reminder?"
                                                                )
                                                            ) {
                                                                return;
                                                            }

                                                            try {

                                                                await api.delete(
                                                                    `/reminders/${reminder._id}`
                                                                );

                                                                fetchReminders();

                                                            } catch (error) {

                                                                console.error(
                                                                    "Failed to delete reminder:",
                                                                    error
                                                                );

                                                                alert(
                                                                    "Failed to delete reminder."
                                                                );
                                                            }
                                                        }}
                                                    >

                                                        <svg
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >

                                                            <polyline points="3 6 5 6 21 6" />

                                                            <path d="M19 6l-1 14H6L5 6" />

                                                            <path d="M10 11v6" />

                                                            <path d="M14 11v6" />

                                                            <path d="M9 6V4h6v2" />

                                                        </svg>

                                                    </button>

                                                </div>

                                            ))}

                                    </div>

                                )}

                            </div>

                        </div>

                    </section>


                    {/* ================= AI ASSISTANT ================= */}

                    <aside className="dashboard-right">

                        <div className="ai-card">

                            {/* AI HEADER */}

                            <div className="ai-card-header">

                                <div className="ai-title-section">

                                    <div className="ai-title-icon">
                                        ✨
                                    </div>

                                    <div>

                                        <h3>
                                            AI Assistant
                                        </h3>

                                        <span>
                                            Your department assistant
                                        </span>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    className="new-chat-button"
                                    onClick={(e) => {

                                        e.preventDefault();
                                        e.stopPropagation();

                                        setAiMessages([]);
                                        setAiInput("");
                                    }}
                                >
                                    ↻ New Chat
                                </button>

                            </div>


                            {/* AI CHAT */}

                            <div className="ai-chat-messages">

                                {aiMessages.length === 0 ? (

                                    <div className="ai-welcome">

                                        <div className="ai-avatar">
                                            ✨
                                        </div>

                                        <div className="ai-welcome-content">

                                            <strong>
                                                Hello, Prajwal! 👋
                                            </strong>

                                            <p>
                                                I'm your DOCMitra AI assistant.
                                                Ask me about your department,
                                                documents, or dashboard.
                                            </p>

                                        </div>

                                    </div>

                                ) : (

                                    aiMessages.map((message, index) => (

                                        <div
                                            key={index}
                                            className={`ai-message ${
                                                message.role === "user"
                                                    ? "ai-user-message"
                                                    : "ai-assistant-message"
                                            }`}
                                        >

                                            <div className="ai-message-avatar">

                                                {message.role === "user"
                                                    ? "👤"
                                                    : "✨"}

                                            </div>


                                            <div className="ai-message-content">
                                                <ReactMarkdown>
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>

                                        </div>

                                    ))

                                )}


                                {aiLoading && (

                                    <div className="ai-message ai-assistant-message">

                                        <div className="ai-message-avatar">
                                            ✨
                                        </div>

                                        <div className="ai-message-content ai-thinking">

                                            <span></span>
                                            <span></span>
                                            <span></span>

                                        </div>

                                    </div>

                                )}

                            </div>


                            {/* AI SUGGESTIONS */}

                            {aiMessages.length === 0 && (

                                <div className="ai-suggestions">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            sendAIMessage(
                                                "How many documents are available in the repository?"
                                            )
                                        }
                                    >
                                        📄 Document count
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            sendAIMessage(
                                                "What can you help me with?"
                                            )
                                        }
                                    >
                                        ✨ What can you do?
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            sendAIMessage(
                                                "Explain the DOCMitra dashboard"
                                            )
                                        }
                                    >
                                        ❓ Explain dashboard
                                    </button>

                                </div>

                            )}


                            {/* AI INPUT */}

                            <div className="ai-input-area">

                                <textarea
                                    placeholder="Ask something about your documents..."
                                    value={aiInput}
                                    onChange={(e) =>
                                        setAiInput(e.target.value)
                                    }
                                    onKeyDown={(e) => {

                                        if (
                                            e.key === "Enter" &&
                                            !e.shiftKey
                                        ) {

                                            e.preventDefault();

                                            sendAIMessage();
                                        }

                                    }}
                                    disabled={aiLoading}
                                    rows={1}
                                />


                                <button
                                    type="button"
                                    className="ai-send-button"
                                    onClick={() => sendAIMessage()}
                                    disabled={
                                        aiLoading ||
                                        !aiInput.trim()
                                    }
                                >
                                    ➤
                                </button>

                            </div>

                        </div>

                    </aside>

                </div>

            </main>


            {/* ================= CALENDAR POPUP ================= */}

            {showCalendar && (

                <div
                    className="calendar-overlay"
                    onClick={() => setShowCalendar(false)}
                >

                    <div
                        className="calendar-popup"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="calendar-popup-header">

                            <button
                                className="calendar-today-button"
                                onClick={() => {

                                    const today = new Date();

                                    setCalendarMonth(today);
                                    setSelectedDate(today);

                                }}
                            >
                                Today
                            </button>


                            <button
                                className="calendar-nav-button"
                                onClick={() =>
                                    setCalendarMonth(
                                        new Date(
                                            calendarMonth.getFullYear(),
                                            calendarMonth.getMonth() - 1,
                                            1
                                        )
                                    )
                                }
                            >
                                ‹
                            </button>


                            <h2>
                                {calendarMonth.toLocaleDateString(
                                    "en-IN",
                                    {
                                        month: "long",
                                        year: "numeric",
                                    }
                                )}
                            </h2>


                            <div className="calendar-header-actions">

                                <button
                                    className="calendar-nav-button"
                                    onClick={() =>
                                        setCalendarMonth(
                                            new Date(
                                                calendarMonth.getFullYear(),
                                                calendarMonth.getMonth() + 1,
                                                1
                                            )
                                        )
                                    }
                                >
                                    ›
                                </button>


                                <button
                                    className="calendar-close-button"
                                    onClick={() =>
                                        setShowCalendar(false)
                                    }
                                >
                                    ✕
                                </button>

                            </div>

                        </div>


                        <div className="calendar-weekdays">

                            {[
                                "Mo",
                                "Tu",
                                "We",
                                "Th",
                                "Fr",
                                "Sa",
                                "Su",
                            ].map((day) => (

                                <span key={day}>
                                    {day}
                                </span>

                            ))}

                        </div>


                        <div className="calendar-days">

                            {Array.from({
                                length:
                                    getFirstDayOfMonth(
                                        calendarMonth
                                    ),
                            }).map((_, index) => (

                                <span
                                    className="calendar-empty"
                                    key={`empty-${index}`}
                                />

                            ))}


                            {Array.from({
                                length:
                                    getDaysInMonth(
                                        calendarMonth
                                    ),
                            }).map((_, index) => {

                                const day = index + 1;

                                const date = new Date(
                                    calendarMonth.getFullYear(),
                                    calendarMonth.getMonth(),
                                    day
                                );

                                const isToday = isSameDate(
                                    date,
                                    new Date()
                                );

                                const isSelected = isSameDate(
                                    date,
                                    selectedDate
                                );

                                const hasReminder =
                                    hasReminderOnDate(day);

                                return (

                                    <button
                                        key={day}
                                        className={`calendar-day
                                            ${isToday ? "today" : ""}
                                            ${isSelected ? "selected" : ""}
                                        `}
                                        onClick={() =>
                                            setSelectedDate(date)
                                        }
                                    >

                                        <span>
                                            {day}
                                        </span>


                                        {hasReminder && (

                                            <i className="calendar-reminder-dot" />

                                        )}

                                    </button>

                                );

                            })}

                        </div>


                        <div className="selected-date-reminders">

                            <h3>
                                {selectedDate.toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    }
                                )}
                            </h3>


                            {selectedDateReminders.length === 0 ? (

                                <p>
                                    No reminders for this date.
                                </p>

                            ) : (

                                selectedDateReminders.map(
                                    (reminder) => (

                                        <div
                                            className="calendar-reminder"
                                            key={reminder._id}
                                        >

                                            <span>
                                                🔔
                                            </span>

                                            <div>

                                                <strong>
                                                    {reminder.title}
                                                </strong>

                                                <p>
                                                    {reminder.description ||
                                                        "Reminder"}
                                                </p>

                                            </div>

                                        </div>

                                    )
                                )

                            )}

                        </div>

                    </div>

                </div>

            )}


            {/* ================= REMINDER FORM ================= */}

            {showReminderForm && (

                <div
                    className="calendar-overlay"
                    onClick={() =>
                        setShowReminderForm(false)
                    }
                >

                    <div
                        className="reminder-form-popup"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <h2>
                            Create Reminder
                        </h2>


                        <input
                            type="text"
                            placeholder="Reminder title"
                            value={reminderTitle}
                            onChange={(e) =>
                                setReminderTitle(
                                    e.target.value
                                )
                            }
                        />


                        <input
                            type="date"
                            value={reminderDate}
                            onChange={(e) =>
                                setReminderDate(
                                    e.target.value
                                )
                            }
                        />


                        <select
                            value={reminderPriority}
                            onChange={(e) =>
                                setReminderPriority(
                                    e.target.value
                                )
                            }
                        >

                            <option>
                                Low
                            </option>

                            <option>
                                Medium
                            </option>

                            <option>
                                High
                            </option>

                        </select>


                        <div className="reminder-form-actions">

                            <button
                                className="cancel-button"
                                onClick={() =>
                                    setShowReminderForm(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>


                            <button
                                className="save-button"
                                onClick={async () => {

                                    if (
                                        !reminderTitle ||
                                        !reminderDate
                                    ) {

                                        alert(
                                            "Please enter a title and date."
                                        );

                                        return;
                                    }


                                    try {

                                        await api.post(
                                            "/reminders",
                                            {
                                                title:
                                                    reminderTitle,
                                                type: "Custom",
                                                priority:
                                                    reminderPriority,
                                                dueDate:
                                                    reminderDate,
                                            }
                                        );


                                        setReminderTitle("");

                                        setReminderDescription("");

                                        setReminderDate("");

                                        setReminderPriority(
                                            "Medium"
                                        );

                                        setShowReminderForm(
                                            false
                                        );

                                        fetchReminders();

                                        alert(
                                            "Reminder created successfully!"
                                        );

                                    } catch (error) {

                                        console.error(
                                            "Failed to create reminder:",
                                            error
                                        );

                                        console.error(
                                            "Server response:",
                                            error.response?.data
                                        );

                                        alert(
                                            error.response?.data
                                                ?.message ||
                                                error.response?.data
                                                    ?.error ||
                                                "Failed to create reminder."
                                        );

                                    }

                                }}
                            >
                                Save Reminder
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};

export default Dashboard;