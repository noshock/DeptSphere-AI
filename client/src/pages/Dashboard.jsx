import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const [documentCount, setDocumentCount] = useState(0);
    const [recentFiles, setRecentFiles] = useState([]);

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

            <aside className="sidebar">
                <h2>DeptSphere AI</h2>

                <nav>
                   <Link to="/dashboard">Dashboard</Link>
                   <Link to="/repository">Repository</Link>
                   <Link to="#">AI Assistant</Link>
                   <Link to="#">Profile</Link> 
                </nav>

                <button>Logout</button>
            </aside>

            <main className="dashboard-content">
                <h1>Welcome to DeptSphere AI</h1>
                <p>Faculty Dashboard</p>

                <div className="dashboard-cards">
                    <div className="card">
                        <h3>Total Documents</h3>
                        <p>{documentCount}</p>
                    </div>

                    <div className="card">
                        <h3>Recent Uploads</h3>
                        <p>0</p>
                    </div>

                    <div className="card">
                        <h3>AI Queries</h3>
                        <p>0</p>
                    </div>
              </div>
                 <div className="recent-files">
                         <h2>Recent Uploads</h2>
  
                         {recentFiles.length === 0 ? (
                         <p>No recent uploads.</p>
                         ) : (
                         recentFiles.map((file) => (
                     <div key={file._id}>
                         <h3>{file.title}</h3>
                         <p>{file.subject}</p>
                         <p>Semester {file.semester}</p>
                      </div>
                        ))
                      )}
                   </div>
            </main>

        </div>
    );
};

export default Dashboard;