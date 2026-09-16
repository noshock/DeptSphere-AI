import { useEffect, useState } from "react";
import api from "../services/api";

const AdminDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [editingDocument, setEditingDocument] = useState(null);

    const fetchDocuments = async () => {
        try {
            const response = await api.get("/repository");
            setDocuments(response.data);
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this document?")) {
            return;
        }

        try {
            await api.delete(`/repository/${id}`);

            setDocuments((currentDocuments) =>
                currentDocuments.filter(
                    (document) => document._id !== id
                )
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
        if (!editingDocument) return;

        try {
            await api.put(`/repository/${editingDocument._id}`, {
                title: editingDocument.title,
                description: editingDocument.description,
                subject: editingDocument.subject,
                department: editingDocument.department,
                session: editingDocument.session,
                term: editingDocument.term,
                category: editingDocument.category,
            });

            await fetchDocuments();

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

    const openDocument = (file) => {
        if (!file.fileUrl) {
            alert("Document file is not available.");
            return;
        }

        const filePath = file.fileUrl.replace(/\\/g, "/");

        const url = filePath.startsWith("http")
            ? filePath
            : `http://localhost:5000/${filePath}`;

        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="admin-documents-page">
            <div className="admin-documents-header">
                <div>
                    <span className="page-badge">
                        DOCUMENT MANAGEMENT
                    </span>

                    <h1>Department Documents</h1>

                    <p>
                        Manage all documents uploaded to the department
                        repository.
                    </p>
                </div>

                <div className="admin-document-count">
                    <span>Total Documents</span>
                    <strong>{documents.length}</strong>
                </div>
            </div>

            <div className="admin-documents-card">
                <div className="admin-documents-card-header">
                    <div>
                        <h2>All Documents</h2>
                        <p>
                            View, edit, open or delete department
                            documents.
                        </p>
                    </div>
                </div>

                {documents.length === 0 ? (
                    <div className="admin-documents-empty">
                        <div className="admin-empty-icon">📄</div>

                        <h3>No documents found</h3>

                        <p>
                            Uploaded department documents will appear
                            here.
                        </p>
                    </div>
                ) : (
                    <div className="admin-document-list">
                        {documents.map((file) => (
                            <div
                                className="admin-document-item"
                                key={file._id}
                            >
                                <div className="admin-document-icon">
                                    📄
                                </div>

                                <div className="admin-document-info">
                                    <h3>{file.title}</h3>

                                    <p className="admin-document-subject">
                                        {file.subject ||
                                            "Department document"}
                                    </p>

                                    <div className="admin-document-meta">
                                        <span>
                                            <strong>Session:</strong>{" "}
                                            {file.session || "N/A"}
                                        </span>

                                        <span>
                                            <strong>Term:</strong>{" "}
                                            {file.term || "N/A"}
                                        </span>

                                        <span>
                                            <strong>Category:</strong>{" "}
                                            {file.category || "Other"}
                                        </span>
                                    </div>

                                    <div className="admin-document-uploader">
                                        Uploaded by{" "}
                                        <strong>
                                            {file.uploadedBy?.name ||
                                                "Unknown Faculty"}
                                        </strong>

                                        {" • "}

                                        Employee ID:{" "}
                                        <strong>
                                            {file.uploadedBy?.employeeId ||
                                                "N/A"}
                                        </strong>
                                    </div>

                                    {editingDocument &&
                                        editingDocument._id ===
                                            file._id && (
                                            <div className="admin-edit-form">
                                                <div className="admin-edit-field">
                                                    <label>
                                                        Title
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={
                                                            editingDocument.title ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setEditingDocument(
                                                                {
                                                                    ...editingDocument,
                                                                    title: e
                                                                        .target
                                                                        .value,
                                                                }
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="admin-edit-field">
                                                    <label>
                                                        Description
                                                    </label>

                                                    <textarea
                                                        value={
                                                            editingDocument.description ||
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setEditingDocument(
                                                                {
                                                                    ...editingDocument,
                                                                    description:
                                                                        e
                                                                            .target
                                                                            .value,
                                                                }
                                                            )
                                                        }
                                                    />
                                                </div>

                                                <div className="admin-edit-row">
                                                    <div className="admin-edit-field">
                                                        <label>
                                                            Subject
                                                        </label>

                                                        <input
                                                            type="text"
                                                            value={
                                                                editingDocument.subject ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                setEditingDocument(
                                                                    {
                                                                        ...editingDocument,
                                                                        subject: e
                                                                            .target
                                                                            .value,
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="admin-edit-field">
                                                        <label>
                                                            Department
                                                        </label>

                                                        <input
                                                            type="text"
                                                            value={
                                                                editingDocument.department ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                setEditingDocument(
                                                                    {
                                                                        ...editingDocument,
                                                                        department:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                <div className="admin-edit-row">
                                                    <div className="admin-edit-field">
                                                        <label>
                                                            Session
                                                        </label>

                                                        <input
                                                            type="text"
                                                            value={
                                                                editingDocument.session ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                setEditingDocument(
                                                                    {
                                                                        ...editingDocument,
                                                                        session:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    }
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    <div className="admin-edit-field">
                                                        <label>
                                                            Term
                                                        </label>

                                                        <select
                                                            value={
                                                                editingDocument.term ||
                                                                "Even"
                                                            }
                                                            onChange={(e) =>
                                                                setEditingDocument(
                                                                    {
                                                                        ...editingDocument,
                                                                        term: e
                                                                            .target
                                                                            .value,
                                                                    }
                                                                )
                                                            }
                                                        >
                                                            <option value="Even">
                                                                Even
                                                            </option>

                                                            <option value="Odd">
                                                                Odd
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="admin-edit-field">
                                                    <label>
                                                        Category
                                                    </label>

                                                    <select
                                                        value={
                                                            editingDocument.category ||
                                                            "Other"
                                                        }
                                                        onChange={(e) =>
                                                            setEditingDocument(
                                                                {
                                                                    ...editingDocument,
                                                                    category:
                                                                        e
                                                                            .target
                                                                            .value,
                                                                }
                                                            )
                                                        }
                                                    >
                                                        <option value="Notes">
                                                            Notes
                                                        </option>

                                                        <option value="Question Paper">
                                                            Question Paper
                                                        </option>

                                                        <option value="Lab Manual">
                                                            Lab Manual
                                                        </option>

                                                        <option value="Assignment">
                                                            Assignment
                                                        </option>

                                                        <option value="PPT">
                                                            PPT
                                                        </option>

                                                        <option value="Syllabus">
                                                            Syllabus
                                                        </option>

                                                        <option value="E-Book">
                                                            E-Book
                                                        </option>

                                                        <option value="Other">
                                                            Other
                                                        </option>
                                                    </select>
                                                </div>

                                                <div className="admin-edit-actions">
                                                    <button
                                                        type="button"
                                                        className="admin-save-button"
                                                        onClick={
                                                            handleUpdate
                                                        }
                                                    >
                                                        Save Changes
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin-cancel-button"
                                                        onClick={() =>
                                                            setEditingDocument(
                                                                null
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                </div>

                                <div className="admin-document-actions">
                                    <button
                                        type="button"
                                        className="admin-open-button"
                                        onClick={() =>
                                            openDocument(file)
                                        }
                                    >
                                        Open
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-edit-button"
                                        onClick={() =>
                                            setEditingDocument(file)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="admin-delete-button"
                                        onClick={() =>
                                            handleDelete(file._id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDocuments;