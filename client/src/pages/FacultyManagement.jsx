import { useEffect, useState } from "react";
import api from "../services/api";

const FacultyManagement = () => {
    const [faculty, setFaculty] = useState([]);
    useEffect(() => {
    const fetchFaculty = async () => {
         try {
             const response = await api.get("/faculty/all");
             setFaculty(response.data);
         }  catch (error) {
             console.error("Error fetching faculty:", error);
         }
     };

     fetchFaculty();
 }, []);
 const handleStatusChange = async (id, isActive) => {
    try {
        await api.put(`/faculty/${id}/status`, {
            isActive: !isActive,
        });

        const response = await api.get("/faculty/all");
        setFaculty(response.data);

    } catch (error) {
        console.error("Error updating faculty status:", error);
    }
 };
 const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty?")) {
        return;
    }

    try {
        await api.delete(`/faculty/${id}`);

        const response = await api.get("/faculty/all");
        setFaculty(response.data);

        alert("Faculty deleted successfully");
    } catch (error) {
        console.error("Error deleting faculty:", error);
        alert(error.response?.data?.message || "Faculty deletion failed");
    }
 };

    return (
        <div>
            <h1>Faculty Management</h1>
            <p>Manage department faculty</p>
            <div>
               {faculty.map((member) => (
            <div key={member._id}>
                <h3>{member.name}</h3>
                <p>Email: {member.email}</p>
                <p>Department: {member.department}</p>
                <p>Designation: {member.designation}</p>
                <p>Employee ID: {member.employeeId}</p>
                <p>Role: {member.role}</p>
                <p>Status: {member.isActive ? "Active" : "Inactive"}</p>
                <button
                   onClick={() => handleStatusChange(member._id, member.isActive)}
                       >
                    {member.isActive ? "Deactivate" : "Activate"}
                </button>
                <button onClick={() => handleDelete(member._id)}>
                   Delete
               </button>
              </div>
             ))}
          </div>
        </div>
    );
};

export default FacultyManagement;