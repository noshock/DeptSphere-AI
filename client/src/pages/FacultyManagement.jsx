import { useEffect, useState } from "react";
import api from "../services/api";

const FacultyManagement = () => {
    const [faculty, setFaculty] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        employeeId: "",
        email: "",
        password: "",
        department: "",
        role: "faculty",
    });

    const fetchFaculty = async () => {
        try {
            const response = await api.get("/faculty/all");

            // Only show faculty accounts
            const facultyOnly = response.data.filter(
                (member) => member.role === "faculty"
            );

            setFaculty(facultyOnly);
        } catch (error) {
            console.error("Error fetching faculty:", error);
        }
    };

    useEffect(() => {
        fetchFaculty();
    }, []);

    const handleStatusChange = async (id, isActive) => {
        try {
            await api.put(`/faculty/${id}/status`, {
                isActive: !isActive,
            });

            fetchFaculty();
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

            fetchFaculty();

            alert("Faculty deleted successfully");
        } catch (error) {
            console.error("Error deleting faculty:", error);

            alert(
                error.response?.data?.message ||
                "Faculty deletion failed"
            );
        }
    };

    const handleAddFaculty = async (e) => {
        e.preventDefault();

        try {
            await api.post("/faculty/create", formData);

            alert("Faculty created successfully");

            setFormData({
                name: "",
                employeeId: "",
                email: "",
                password: "",
                department: "",
                role: "faculty",
            });

            setShowAddForm(false);

            fetchFaculty();
        } catch (error) {
            console.error("Error creating faculty:", error);

            alert(
                error.response?.data?.message ||
                "Faculty creation failed"
            );
        }
    };

    const filteredFaculty = faculty.filter((member) => {
        const query = search.toLowerCase();

        return (
            member.name?.toLowerCase().includes(query) ||
            member.email?.toLowerCase().includes(query) ||
            member.employeeId?.toLowerCase().includes(query) ||
            member.department?.toLowerCase().includes(query)
        );
    });

    const totalFaculty = faculty.length;

    const activeFaculty = faculty.filter(
        (member) => member.isActive
    ).length;

    const inactiveFaculty = faculty.filter(
        (member) => !member.isActive
    ).length;

    const getInitials = (name) => {
        if (!name) return "F";

        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    return (
        <div className="faculty-management-page">

            {/* ================= HEADER ================= */}

            <div className="faculty-page-header">

                <div>
                    <div className="page-badge">
                        FACULTY MANAGEMENT
                    </div>

                    <h1>Faculty Management</h1>

                    <p>
                        Manage department faculty, accounts and access.
                    </p>
                </div>

                <button
                    className="add-faculty-button"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? "✕ Cancel" : "+ Add Faculty"}
                </button>

            </div>


            {/* ================= STATS ================= */}

            <div className="faculty-stats">

                <div className="faculty-stat-card">
                    <div className="faculty-stat-icon">
                        👥
                    </div>

                    <div>
                        <span>Total Faculty</span>
                        <strong>{totalFaculty}</strong>
                        <small>Department faculty</small>
                    </div>
                </div>


                <div className="faculty-stat-card">
                    <div className="faculty-stat-icon active">
                        ✓
                    </div>

                    <div>
                        <span>Active Faculty</span>
                        <strong>{activeFaculty}</strong>
                        <small>Currently active</small>
                    </div>
                </div>


                <div className="faculty-stat-card">
                    <div className="faculty-stat-icon inactive">
                        ○
                    </div>

                    <div>
                        <span>Inactive Faculty</span>
                        <strong>{inactiveFaculty}</strong>
                        <small>Access disabled</small>
                    </div>
                </div>

            </div>


            {/* ================= ADD FACULTY ================= */}

            {showAddForm && (
                <div className="add-faculty-panel">

                    <div className="add-faculty-panel-header">
                        <div>
                            <h2>Add New Faculty</h2>
                            <p>
                                Create a faculty account for the department.
                            </p>
                        </div>
                    </div>


                    <form
                        className="faculty-form"
                        onSubmit={handleAddFaculty}
                    >

                        <div className="form-field">
                            <label>Full Name</label>

                            <input
                                type="text"
                                placeholder="Enter faculty name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>


                        <div className="form-field">
                            <label>Employee ID</label>

                            <input
                                type="text"
                                placeholder="Enter employee ID"
                                value={formData.employeeId}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        employeeId: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>


                        <div className="form-field">
                            <label>Email Address</label>

                            <input
                                type="email"
                                placeholder="faculty@example.com"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>


                        <div className="form-field">
                            <label>Temporary Password</label>

                            <input
                                type="password"
                                placeholder="Create password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>


                        <div className="form-field">
                            <label>Department</label>

                            <input
                                type="text"
                                placeholder="Information Technology"
                                value={formData.department}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        department: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>


                        <div className="form-field">
                            <label>Role</label>

                            <select
                                value={formData.role}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        role: e.target.value,
                                    })
                                }
                            >
                                <option value="faculty">
                                    Faculty
                                </option>
                            </select>
                        </div>


                        <div className="faculty-form-actions">

                            <button
                                type="button"
                                className="cancel-form-button"
                                onClick={() => setShowAddForm(false)}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-faculty-button"
                            >
                                Create Faculty
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* ================= FACULTY DIRECTORY ================= */}

            <div className="faculty-directory-card">

                <div className="faculty-directory-header">

                    <div>
                        <h2>Faculty Directory</h2>
                        <p>
                            {filteredFaculty.length} faculty member
                            {filteredFaculty.length !== 1 ? "s" : ""}
                        </p>
                    </div>


                    <div className="faculty-search">

                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search faculty..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </div>


                <div className="faculty-table-wrapper">

                    <table className="faculty-table">

                        <thead>
                            <tr>
                                <th>Faculty</th>
                                <th>Employee ID</th>
                                <th>Department</th>
                                <th>Designation</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>


                        <tbody>

                            {filteredFaculty.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="6"
                                        className="faculty-empty"
                                    >
                                        <div>
                                            <span>👥</span>
                                            <strong>
                                                No faculty found
                                            </strong>
                                            <p>
                                                Try a different search
                                                or add a new faculty.
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                            ) : (

                                filteredFaculty.map((member) => (

                                    <tr key={member._id}>

                                        <td>

                                            <div className="faculty-member">

                                                <div className="faculty-avatar">
                                                    {member.profilePhoto ? (
                                                        <img
                                                            src={`http://localhost:5000${member.profilePhoto}`}
                                                            alt={member.name}
                                                        />
                                                    ) : (
                                                        getInitials(
                                                            member.name
                                                        )
                                                    )}
                                                </div>

                                                <div>
                                                    <strong>
                                                        {member.name}
                                                    </strong>

                                                    <span>
                                                        {member.email}
                                                    </span>
                                                </div>

                                            </div>

                                        </td>


                                        <td>
                                            <span className="employee-id">
                                                {member.employeeId}
                                            </span>
                                        </td>


                                        <td>
                                            {member.department || "—"}
                                        </td>


                                        <td>
                                            {member.designation || "Faculty"}
                                        </td>


                                        <td>

                                            <span
                                                className={`faculty-status ${
                                                    member.isActive
                                                        ? "status-active"
                                                        : "status-inactive"
                                                }`}
                                            >
                                                <span></span>

                                                {member.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>

                                        </td>


                                        <td>

                                            <div className="faculty-actions">

                                                <button
                                                    className={
                                                        member.isActive
                                                            ? "deactivate-button"
                                                            : "activate-button"
                                                    }
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            member._id,
                                                            member.isActive
                                                        )
                                                    }
                                                >
                                                    {member.isActive
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </button>

                                                <button
                                                    className="delete-faculty-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            member._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

export default FacultyManagement;