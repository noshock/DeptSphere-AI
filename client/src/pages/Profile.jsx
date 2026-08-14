import { useEffect, useState } from "react";
import api from "../services/api";

const Profile = () => {
    const [faculty, setFaculty] = useState(null);
    
    useEffect(() => {
    const fetchProfile = async () => {
        try {
            const response = await api.get("/faculty/profile");
            setFaculty(response.data);
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    fetchProfile();
 }, []);

    return (
    <div className="profile-page">
        <h1>Faculty Profile</h1>

        {!faculty ? (
            <p>Loading profile...</p>
        ) : (
            <div className="profile-card">

                <div className="profile-page-avatar">
                    👤
                </div>

                <h2>{faculty.name}</h2>
                <p className="profile-role">
                    {faculty.designation}
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
                        <strong>Employee ID</strong>
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
                     <h2>Faculty Portfolio</h2>
                     <span>Professional Information</span>
                  </div>

                  <div className="portfolio-grid">

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

                 </div>
             </div>

            </div>
        )}
    </div>
)};

export default Profile;