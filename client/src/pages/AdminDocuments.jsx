import { useEffect, useState } from "react";
import api from "../services/api";

const AdminDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [editingDocument, setEditingDocument] = useState(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await api.get("/repository");
                setDocuments(response.data);
            } catch (error) {
                console.error("Error fetching documents:", error);
            }
        };

        fetchDocuments();
    }, []);

 const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
        return;
    }

    try {
        await api.delete(`/repository/${id}`);

        setDocuments(
            documents.filter((document) => document._id !== id)
        );

        alert("Document deleted successfully");

    } catch (error) {
        console.error("Delete error:", error);

        alert(
            error.response?.data?.message ||
            "Document deletion failed"
        );
    }
 };

 const handleUpdate = async () => {
    try {
        await api.put(`/repository/${editingDocument._id}`, {
            title: editingDocument.title,
            description: editingDocument.description,
            subject: editingDocument.subject,
            department: editingDocument.department,
            semester: editingDocument.semester,
            category: editingDocument.category,
        });

        const response = await api.get("/repository");
        setDocuments(response.data);

        setEditingDocument(null);

        alert("Document updated successfully");

    } catch (error) {
        console.error("Update error:", error);

        alert(
            error.response?.data?.message ||
            "Document update failed"
        );
    }
 };

    return (
        <div className="dashboard-content">

            <h1>Document Management</h1>
            <p>Manage department documents and uploaded files.</p>

            <div className="recent-files">

                <h2>All Documents</h2>

                {documents.length === 0 ? (
                    <p>No documents found.</p>
                ) : (
                    documents.map((file) => (
                        <div
                            className="recent-file"
                            key={file._id}
                        >
                            <h3>{file.title}</h3>

                            <p>
                                Subject: {file.subject}
                            </p>

                            <p>
                                Semester: {file.semester}
                            </p>

                            <p>
                                Category: {file.category}
                            </p>

                            <p>
                                Uploaded By:{" "}
                                <strong>
                                    {file.uploadedBy?.name ||
                                        "Unknown Faculty"}
                                </strong>
                            </p>

                            <p>
                                Registration ID:{" "}
                                {file.uploadedBy?.employeeId ||
                                    "N/A"}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    window.open(
                                        `http://localhost:5000/${file.fileUrl.replace(
                                            /\\/g,
                                            "/"
                                        )}`,
                                        "_blank"
                                    )
                                }
                            >
                                Open
                            </button>
                            <button
                               type="button"
                               onClick={() => handleDelete(file._id)}
                           >
                               Delete
                           </button>
                           <button
                               type="button"
                               onClick={() => setEditingDocument(file)}
                           >
                               Edit
                           </button>
                           {editingDocument &&
    editingDocument._id === file._id && (
        <div className="edit-document-form">

            <input
                type="text"
                value={editingDocument.title}
                onChange={(e) =>
                    setEditingDocument({
                        ...editingDocument,
                        title: e.target.value,
                    })
                }
                placeholder="Title"
            />

            <input
                type="text"
                value={editingDocument.description || ""}
                onChange={(e) =>
                    setEditingDocument({
                        ...editingDocument,
                        description: e.target.value,
                    })
                }
                placeholder="Description"
            />

            <input
                type="text"
                value={editingDocument.subject}
                onChange={(e) =>
                    setEditingDocument({
                        ...editingDocument,
                        subject: e.target.value,
                    })
                }
                placeholder="Subject"
            />

            <input
                type="text"
                value={editingDocument.department}
                onChange={(e) =>
                    setEditingDocument({
                        ...editingDocument,
                        department: e.target.value,
                    })
                }
                placeholder="Department"
            />

            <input
                type="number"
                value={editingDocument.semester}
                onChange={(e) =>
                    setEditingDocument({
                        ...editingDocument,
                        semester: e.target.value,
                    })
                }
                placeholder="Semester"
            />

            <select
                value={editingDocument.category}
                onChange={(e) =>
                    setEditingDocument({
                        ...editingDocument,
                        category: e.target.value,
                    })
                }
            >
                <option value="Notes">Notes</option>
                <option value="Question Paper">
                    Question Paper
                </option>
                <option value="Lab Manual">
                    Lab Manual
                </option>
                <option value="Assignment">
                    Assignment
                </option>
                <option value="PPT">PPT</option>
                <option value="Syllabus">Syllabus</option>
                <option value="E-Book">E-Book</option>
                <option value="Other">Other</option>
            </select>

            <button onClick={handleUpdate}>
                Save
            </button>

            <button
                onClick={() => setEditingDocument(null)}
            >
                Cancel
            </button>

        </div>
    )}
                           
                        </div>
                    ))
                )}

            </div>
             
       </div>
    );
                
};
             
export default AdminDocuments;             