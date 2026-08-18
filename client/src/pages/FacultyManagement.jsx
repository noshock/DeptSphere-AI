import { useEffect, useState } from "react";
import api from "../services/api";

const FacultyManagement = () => {
    const [faculty, setFaculty] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

     const [formData, setFormData] = useState({
         name: "",
         employeeId: "",
         email: "",
         password: "",
         department: "",
         role: "faculty",
    });
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

 const handleAddFaculty = async (e) => {
    e.preventDefault();

    try {
        await api.post("/faculty/create", formData);

        alert("Faculty created successfully");

        const response = await api.get("/faculty/all");
        setFaculty(response.data);

        setFormData({
            name: "",
            employeeId: "",
            email: "",
            password: "",
            department: "",
            role: "faculty",
        });

        setShowAddForm(false);

    } catch (error) {
        console.error("Error creating faculty:", error);

        alert(
            error.response?.data?.message ||
            "Faculty creation failed"
        );
    }
 };

    return (
    <div className="faculty-management-page">
            <h1>Faculty Management</h1>
            <p>Manage department faculty</p>
            <button onClick={() => setShowAddForm(!showAddForm)}>
               {showAddForm ? "Cancel" : "Add Faculty"}
            </button>
            {showAddForm && (
                  <form onSubmit={handleAddFaculty}>
              
                      <input
                          type="text"
                          placeholder="Name"
                          value={formData.name}
                          onChange={(e) =>
                              setFormData({
                                  ...formData,
                                  name: e.target.value,
                              })
                          }
                      />
              
                      <input
                          type="text"
                          placeholder="Registration ID"
                          value={formData.employeeId}
                          onChange={(e) =>
                              setFormData({
                                  ...formData,
                                  employeeId: e.target.value,
                              })
                          }
                      />
              
                      <input
                          type="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={(e) =>
                              setFormData({
                                  ...formData,
                                  email: e.target.value,
                              })
                          }
                      />
              
                      <input
                          type="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={(e) =>
                              setFormData({
                                  ...formData,
                                  password: e.target.value,
                              })
                          }
                      />
              
                      <input
                          type="text"
                          placeholder="Department"
                          value={formData.department}
                          onChange={(e) =>
                              setFormData({
                                  ...formData,
                                  department: e.target.value,
                              })
                          }
                      />
              
                      <select
                          value={formData.role}
                          onChange={(e) =>
                              setFormData({
                                  ...formData,
                                  role: e.target.value,
                              })
                          }
                      >
                          <option value="faculty">Faculty</option>
                          <option value="admin">Admin</option>
                      </select>
              
                      <button type="submit">
                          Create Faculty
                      </button>
              
                  </form>
              )}
               <div className="faculty-list">
                   {faculty.map((member) => (
               <div className="faculty-card" key={member._id}>
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