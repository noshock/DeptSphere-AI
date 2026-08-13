import { useEffect, useState } from "react";
import api from "../services/api";

const AdminDashboard = () => {
    const [faculty, setFaculty] = useState([]);
    const [documents, setDocuments] = useState(0);
    useEffect(() => {
     const fetchData = async () => {
         try {
            const facultyResponse = await api.get("/faculty/all");
            const repositoryResponse = await api.get("/repository");

            setFaculty(facultyResponse.data);
            setDocuments(repositoryResponse.data.length);
         } catch (error) {
            console.error("Error fetching admin data:", error);
         }
     };

     fetchData();
 },  []);

    return (
    <div className="dashboard">

        <aside className="sidebar">
            <h2>DeptSphere AI</h2>

            <nav>
                <a href="/admin-dashboard">Dashboard</a>
                <a href="/faculty-management">Faculty Management</a>
                <a href="/repository">Repository</a>
                <a href="#">AI Assistant</a>
                <a href="#">Profile</a>
            </nav>

            <button>Logout</button>
        </aside>

        <main className="dashboard-content">
            <h1>DeptSphere AI Admin Dashboard</h1>
            <p>Welcome, Admin</p>

            <div className="dashboard-cards">
                <div className="card">
                    <h3>Total Faculty</h3>
                    <p>{faculty.length}</p>
                </div>

                <div className="card">
                    <h3>Active Faculty</h3>
                    <p>{faculty.filter((member) => member.isActive).length}</p>
                </div>

                <div className="card">
                    <h3>Inactive Faculty</h3>
                    <p>{faculty.filter((member) => !member.isActive).length}</p>
                </div>

                <div className="card">
                    <h3>Total Documents</h3>
                    <p>{documents}</p>
                </div>
            </div>
        </main>

    </div>
)};

export default AdminDashboard;