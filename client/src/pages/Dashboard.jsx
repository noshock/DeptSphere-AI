import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [documentCount, setDocumentCount] = useState(0);
    const [recentFiles, setRecentFiles] = useState([]);
    const [showProfile, setShowProfile] = useState(false);

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
                    <span>Welcome PRAJWAL</span>
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

                  <button className="logout-button">
                     Log Out
                 </button>
                </div>
               )}
            </div>

        </header>

        {/* Sidebar */}
        <aside className="sidebar">

            <nav>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/repository">Repository</Link>
                <Link to="/repository">Upload</Link>
                <Link to="#">Reminder</Link>
                <Link to="#">AI Assistant</Link>
            </nav>

        </aside>

        {/* Main Content */}
        <main className="dashboard-content">

            <h1>Welcome to DOCMitra AI</h1>

            <div className="dashboard-main">

                <section className="dashboard-center">

                   <div className="dashboard-cards">

                   <div className="card">
                   <div className="card-icon">📄</div>
                   <div>
                      <h3>Total Documents</h3>
                      <p>{documentCount}</p>
                      <span>Available in repository</span>
                  </div>
                    </div>

                     <div className="card">
                      <div className="card-icon">⬆️</div>
                     <div>
                         <h3>Recent Uploads</h3>
                         <p>{recentFiles.length}</p>
                         <span>Latest documents</span>
                       </div>
                    </div>

                     <div className="card">
                    <div className="card-icon">✨</div>
                    <div>
                       <h3>AI Queries</h3>
                       <p>0</p>
                      <span>AI interactions</span>
                  </div>
                  </div>

                 </div>
                    <div className="recent-files">

                        <h2>Recent Documents</h2>

                        {recentFiles.length === 0 ? (
                            <p>No recent uploads.</p>
                        ) : (
                            recentFiles.map((file) => (
                                <div className="recent-file" key={file._id}>
                                    <h3>{file.title}</h3>
                                    <p>{file.subject}</p>
                                    <p>Semester {file.semester}</p>
                                </div>
                            ))
                        )}

                    </div>

                </section>

                <aside className="dashboard-right">

                    <div className="calendar-card">
                       <div className="calendar-icon">📅</div>

                       <div className="calendar-info">
                           <h3>{new Date().toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric"
                             })}</h3>

                           <p>{new Date().toLocaleDateString("en-IN", {
                           weekday: "long"
                          })}</p>
                        </div>
                      </div>

                    <div className="reminder-card">
                      <div className="panel-header">
                         <h3>Smart Reminders</h3>
                         <span>View All</span>
                      </div>

                        <div className="reminder-item">
                       <div className="reminder-icon reminder-red">📅</div>
                       <div>
                           <strong>Upcoming Department Event</strong>
                           <p>Check event details and schedule</p>
                      </div>
                    </div>

                              <div className="reminder-item">
                              <div className="reminder-icon reminder-orange">⚠️</div>
                             <div>
                                  <strong>Document Reminder</strong>
                                 <p>Important document needs attention</p>
                              </div>
                             </div>

                           <div className="reminder-item">
                            <div className="reminder-icon reminder-blue">ℹ️</div>
                            <div>
                                 <strong>Department Notice</strong>
                                 <p>New information is available</p>
                                   </div>
                             </div>
                           </div>

                    <div className="ai-card">
                      <div className="panel-header">
                          <h3>AI Assistant</h3>
                          <span>New Chat</span>
                      </div>

                       <div className="ai-welcome">
                          <div className="ai-avatar">✨</div>

                   <div>
                         <strong>Hello, Prajwal! 👋</strong>
                         <p>Ask me anything about your department documents.</p>
                    </div>
                 </div>

                 <div className="ai-suggestions">
                      <button>Summarize a document</button>
                      <button>Find important topics</button>
                      <button>Generate questions</button>
                 </div>
                </div>

                </aside>

            </div>

        </main>

    </div>
)};

export default Dashboard;