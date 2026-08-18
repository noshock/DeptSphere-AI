import { useEffect, useState } from "react";
import api from "../services/api";

const Profile = () => {
    const [faculty, setFaculty] = useState(null);
    const [facultyCount, setFacultyCount] = useState(0);
    const [documentCount, setDocumentCount] = useState(0);
    const [activeFaculty, setActiveFaculty] = useState(0);
    
    useEffect(() => {
    const fetchProfile = async () => {
        try {
            const response = await api.get("/faculty/profile");
            setFaculty(response.data);
            const facultyResponse = await api.get("/faculty/all");
            const repositoryResponse = await api.get("/repository");
            
            setFacultyCount(facultyResponse.data.length);
            setDocumentCount(repositoryResponse.data.length);
            setActiveFaculty(
            facultyResponse.data.filter((member) => member.isActive).length
        );
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    fetchProfile();
 }, []);

    return (
    <div className="profile-page">
       <h1>
           {faculty?.role === "admin" ? "Admin Profile" : "Faculty Profile"}
       </h1>

        {!faculty ? (
            <p>Loading profile...</p>
        ) : (
            <div className="profile-card">

                <div className="profile-page-avatar">
                    👤
                </div>

                <h2>{faculty.name}</h2>
                 <p className="profile-role">
                     {faculty.role === "admin"
                         ? "Administrator"
                         : faculty.designation}
                 </p>

                <div className="profile-details">

                    <div>
                        <strong>Email</strong>
                        <p>{faculty.email}</p>
                    </div>

                    <div>
                        <strong>Department</strong>
                        <p>{faculty.department}</p>
                    </div>

                    <div>
                       <strong>Registration ID</strong>
                       <p>{faculty.employeeId}</p>
                    </div>

                    <div>
                        <strong>Role</strong>
                        <p>{faculty.role}</p>
                    </div>

                    <div>
                        <strong>Status</strong>
                        <p>
                            {faculty.isActive ? "Active" : "Inactive"}
                        </p>
                    </div>

                </div>
                   <div className="portfolio-section">
                   
                       <div className="portfolio-header">
                           <h2>
                               {faculty.role === "admin"
                                   ? "Administration"
                                   : "Faculty Portfolio"}
                           </h2>
                   
                           <span>
                               {faculty.role === "admin"
                                   ? "Department Management"
                                   : "Professional Information"}
                           </span>
                       </div>
                   
                       <div className="portfolio-grid">
                   
                           {faculty.role === "admin" ? (
                               <>
                                   <div className="portfolio-item">
                                       <h3>Faculty Managed</h3>
                                       <p>{facultyCount}</p>
                                   </div>
                   
                                   <div className="portfolio-item">
                                       <h3>Documents Managed</h3>
                                       <p>{documentCount}</p>
                                   </div>
                   
                                   <div className="portfolio-item">
                                       <h3>Active Faculty</h3>
                                       <p>{activeFaculty}</p>
                                   </div>
                   
                                   <div className="portfolio-item">
                                       <h3>Department</h3>
                                       <p>{faculty.department}</p>
                                   </div>
                               </>
                           ) : (
                               <>
                                   <div className="portfolio-item">
                                       <h3>Research Papers</h3>
                                       <p>0</p>
                                   </div>
                   
                                   <div className="portfolio-item">
                                       <h3>Publications</h3>
                                       <p>0</p>
                                   </div>
                   
                                   <div className="portfolio-item">
                                       <h3>Projects</h3>
                                       <p>0</p>
                                   </div>
                   
                                   <div className="portfolio-item">
                                       <h3>Certifications</h3>
                                       <p>0</p>
                                   </div>
                               </>
                           )}
                   
                       </div>
                   
                   </div>

            </div>
        )}
    </div>
)};

export default Profile;