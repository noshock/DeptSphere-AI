import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
const DepartmentFiles = () => {
    return (
        <div className="semester-files">
            
            <Link to="/repository?dfile=D.1">
                D.1 Academic Calendar
            </Link>

            <div className="submenu-parent">
                <div className="submenu-parent-title">
                    <span>D.2 Faculty Work Load / Time Table</span>
                    <span>›</span>
                </div>

                <div className="nested-submenu">
                    <Link to="/repository">
                        D.2A Faculty Work Load
                    </Link>

                    <Link to="/repository">
                        D.2B Time Table
                    </Link>
                </div>
            </div>

            <div className="submenu-parent">
                <div className="submenu-parent-title">
                    <span>D.3 Student Roll List</span>
                    <span>›</span>
                </div>

                <div className="nested-submenu">
                    <Link to="/repository">
                        D.3A Student Roll List UG
                    </Link>

                    <Link to="/repository">
                        D.3B Student Roll List PG
                    </Link>

                    <Link to="/repository">
                        D.3C Student Roll List PhD
                    </Link>
                </div>
            </div>

            <div className="submenu-parent">
                <div className="submenu-parent-title">
                    <span>D.4 Open Elective</span>
                    <span>›</span>
                </div>

                <div className="nested-submenu">
                    <Link to="/repository">
                        D.4A Open Elective UG
                    </Link>

                    <Link to="/repository">
                        D.4B Open Elective PG
                    </Link>
                </div>
            </div>

            <Link to="/repository">
                D.5 Project Allotment
            </Link>

            <Link to="/repository">
                D.6 Content Beyond Syllabus
            </Link>

            <Link to="/repository">
                D.7 HoD Meeting
            </Link>

            <div className="submenu-parent">
                <div className="submenu-parent-title">
                    <span>D.8 Meetings</span>
                    <span>›</span>
                </div>

                <div className="nested-submenu">
                    <Link to="/repository">
                        D.8A BoS
                    </Link>

                    <Link to="/repository">
                        D.8B AC
                    </Link>

                    <Link to="/repository">
                        D.8C Governing Body
                    </Link>
                </div>
            </div>

        </div>
    );
};
const Dashboard = () => {
    const [documentCount, setDocumentCount] = useState(0);
    const [recentFiles, setRecentFiles] = useState([]);
    const [showProfile, setShowProfile] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [activeSemester, setActiveSemester] = useState(null);
    const [activeRepositorySemester, setActiveRepositorySemester] = useState(null);
    const [activeUploadSemester, setActiveUploadSemester] = useState(null);

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
                 <Link to="/dashboard">Dashboard</Link>

                   <div
                        className="dfile-menu-area"
                        onMouseEnter={() => setActiveMenu("repository")}
                        onMouseLeave={() => {
                            setActiveMenu(null);
                            setActiveRepositorySemester(null);
                        }}
                    >
                        <button className="sidebar-menu-button">
                            <span>Repository</span>
                            <span>›</span>
                        </button>
                    
                        {activeMenu === "repository" && (
                            <div className="sidebar-submenu">
                                <h3>Repository</h3>
                    
                                <div
                                    className="semester-option"
                                    onMouseEnter={() =>
                                        setActiveRepositorySemester("even")
                                    }
                                >
                                    <span>Even Semester</span>
                                    <span>›</span>
                    
                                    {activeRepositorySemester === "even" && (
                                        <div className="nested-submenu">
                                            <Link to="/repository?semester=2">
                                                Semester 2
                                            </Link>
                    
                                            <Link to="/repository?semester=4">
                                                Semester 4
                                            </Link>
                    
                                            <Link to="/repository?semester=6">
                                                Semester 6
                                            </Link>
                    
                                            <Link to="/repository?semester=8">
                                                Semester 8
                                            </Link>
                                        </div>
                                    )}
                                </div>
                    
                                <div
                                    className="semester-option"
                                    onMouseEnter={() =>
                                        setActiveRepositorySemester("odd")
                                    }
                                >
                                    <span>Odd Semester</span>
                                    <span>›</span>
                    
                                    {activeRepositorySemester === "odd" && (
                                        <div className="nested-submenu">
                                            <Link to="/repository?semester=1">
                                                Semester 1
                                            </Link>
                    
                                            <Link to="/repository?semester=3">
                                                Semester 3
                                            </Link>
                    
                                            <Link to="/repository?semester=5">
                                                Semester 5
                                            </Link>
                    
                                            <Link to="/repository?semester=7">
                                                Semester 7
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                      className="dfile-menu-area"
                      onMouseEnter={() => setActiveMenu("upload")}
                      onMouseLeave={() => {
                          setActiveMenu(null);
                          setActiveUploadSemester(null);
                      }}
                  >
                      <button className="sidebar-menu-button">
                          <span>Upload</span>
                          <span>›</span>
                      </button>
                  
                      {activeMenu === "upload" && (
                          <div className="sidebar-submenu">
                              <h3>Upload Document</h3>
                  
                              <div
                                  className="semester-option"
                                  onMouseEnter={() =>
                                      setActiveUploadSemester("even")
                                  }
                              >
                                  <span>Even Semester</span>
                                  <span>›</span>
                  
                                  {activeUploadSemester === "even" && (
                                      <div className="nested-submenu">
                                          <Link to="/upload?semester=2">
                                              Semester 2
                                          </Link>
                  
                                          <Link to="/upload?semester=4">
                                              Semester 4
                                          </Link>
                  
                                          <Link to="/upload?semester=6">
                                              Semester 6
                                          </Link>
                  
                                          <Link to="/upload?semester=8">
                                              Semester 8
                                          </Link>
                                      </div>
                                  )}
                              </div>
                  
                              <div
                                  className="semester-option"
                                  onMouseEnter={() =>
                                      setActiveUploadSemester("odd")
                                  }
                              >
                                  <span>Odd Semester</span>
                                  <span>›</span>
                  
                                  {activeUploadSemester === "odd" && (
                                      <div className="nested-submenu">
                                          <Link to="/upload?semester=1">
                                              Semester 1
                                          </Link>
                  
                                          <Link to="/upload?semester=3">
                                              Semester 3
                                          </Link>
                  
                                          <Link to="/upload?semester=5">
                                              Semester 5
                                          </Link>
                  
                                          <Link to="/upload?semester=7">
                                              Semester 7
                                          </Link>
                                      </div>
                                  )}
                              </div>
                          </div>
                      )}
                  </div>

                    <button
                        className="sidebar-menu-button"
                        onClick={() => setActiveMenu(activeMenu === "ai" ? null : "ai")}
                    >
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