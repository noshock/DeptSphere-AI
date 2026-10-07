import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

const Repository = () => {
    const [files, setFiles] = useState([]);
const [search, setSearch] = useState("");
const [editingFile, setEditingFile] = useState(null);
const [selectedCategory, setSelectedCategory] = useState(null);

    const categories = [
        "Event",
        "Holiday Notice",
        "Placement Notice",
        "Examination",
        "Circular",
        "Report",
        "Application",
        "Assignment",
        "Other",
    ];
    const getRepositoryCategory = (category) => {
        if (category === "Placement") {
            return "Placement Notice";
        }
    
        return categories.includes(category) ? category : "Other";
    };

    const [searchParams] = useSearchParams();

    const selectedSession = searchParams.get("session");
    const selectedTermParam = searchParams.get("term");

    const highlightId = searchParams.get("highlight");
    
    const selectedTerm =
        selectedTermParam === "even"
            ? "Even"
            : selectedTermParam === "odd"
            ? "Odd"
            : null;


    // =========================
    // FETCH FILES
    // =========================

    const fetchFiles = async () => {
        try {
            let response;

            if (selectedSession) {
                const params = new URLSearchParams();

                params.append("session", selectedSession);

                if (selectedTerm) {
                    params.append("term", selectedTerm);
                }

                response = await api.get(
                    `/repository/filter/session?${params.toString()}`
                );
            } else {
                response = await api.get("/repository");
            }

            setFiles(response.data);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };


    useEffect(() => {
        fetchFiles();
    }, [selectedSession, selectedTermParam]);

    useEffect(() => {
        if (!highlightId || !files.length) return;
    
        const element = document.getElementById(
            `repository-file-${highlightId}`
        );
    
        if (!element) return;
    
        element.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    
        element.classList.add("repository-highlight");
    
        const timer = setTimeout(() => {
            element.classList.remove("repository-highlight");
        }, 3000);
    
        return () => clearTimeout(timer);
    }, [files, highlightId]);


    // =========================
    // DELETE FILE
    // =========================

    const handleDelete = async (id) => {
        try {
            await api.delete(`/repository/${id}`);

            await fetchFiles();

            alert("File deleted successfully");
        } catch (error) {
            console.error("Delete error:", error);

            alert("File deletion failed");
        }
    };


    // =========================
    // UPDATE FILE
    // =========================

    const handleUpdate = async () => {
        try {
            await api.put(`/repository/${editingFile._id}`, {
                title: editingFile.title,
                description: editingFile.description,
            });

            await fetchFiles();

            setEditingFile(null);

            alert("File updated successfully");
        } catch (error) {
            console.error("Update error:", error);

            alert("File update failed");
        }
    };


    // =========================
    // SEARCH
    // =========================

const handleSearch = async () => {
    const query = search.trim();

    if (!query) {
        fetchFiles();
        return;
    }

    try {
        const response = await api.get(
            `/repository/search?title=${encodeURIComponent(query)}`
        );

        setFiles(response.data);
    } catch (error) {
        console.error("Search failed:", error);
    }
};


    // =========================
    // OPEN FILE
    // =========================

const handleOpenFile = (fileUrl) => {
    if (!fileUrl) {
        alert("File URL not available.");
        return;
    }

    const fileName = fileUrl
        .replace(/\\/g, "/")
        .split("/")
        .pop();

    const fileUrlToOpen =
        `http://localhost:5000/uploads/${fileName}`;

    window.open(fileUrlToOpen, "_blank", "noopener,noreferrer");
};


    return (
        <div className="repository-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="repository-header">

                <div>

                    <span className="page-badge">
                        DOCUMENT REPOSITORY
                    </span>

                    <h1>
                        Repository
                    </h1>

                    <p>
                        Access and manage department documents.
                    </p>

                </div>


                {/* SELECTED SESSION / TERM */}

                {selectedSession && (
                    <div className="repository-semester">

                        Session {selectedSession}

                        {selectedTerm && (
                            <> — {selectedTerm}</>
                        )}

                    </div>
                )}

            </div>


            {/* =========================
                SEARCH TOOLBAR
            ========================= */}

            <div className="repository-toolbar">

                <input
                    className="repository-search"
                    type="text"
                    placeholder="Search documents by title..."
                    value={search}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearch(value);
                    
                        if (!value.trim()) {
                            fetchFiles();
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />


                <button
                    className="repository-search-button"
                    onClick={handleSearch}
                >
                    Search
                </button>

            </div>

            {selectedCategory && (
                <button
                    className="repository-back-button"
                    onClick={() => setSelectedCategory(null)}
                >
                    ← Back to Categories
                </button>
            )}

             

            {/* =========================
                  CATEGORY FOLDERS
                ========================= */}
               
               {!selectedCategory && (
                   <div className="repository-category-grid">
                       {categories.map((category) => (
                           <div
                               key={category}
                               className="repository-category-card"
                               onClick={() => setSelectedCategory(category)}
                           >
                               <div className="repository-category-icon">
                                   📂
                               </div>
               
                              <h3>{category}</h3>
               
                                <p className="repository-category-count">
                                    {files.filter(
                                        (file) => getRepositoryCategory(file.category) === category
                                    ).length}{" "}
                                    {files.filter(
                                        (file) => getRepositoryCategory(file.category) === category
                                    ).length === 1
                                        ? "document"
                                        : "documents"}
                                </p>
                           </div>
                       ))}
                   </div>
              )}


            {/* =========================
                EMPTY STATE
            ========================= */}
        {selectedCategory && (
            files.filter(
                (file) =>
                    !selectedCategory ||
                    getRepositoryCategory(file.category) === selectedCategory
            ).length === 0 ? (

                <div className="repository-empty">

                    <h3>
                        No documents found
                    </h3>

                    <p>
                        There are no documents available
                        for this session and term yet.
                    </p>

                </div>

            ) : (

                /* =========================
                   FILE LIST
                ========================= */

                <div className="repository-list">

                    {files
                        .filter(
                            (file) =>
                                !selectedCategory ||
                                getRepositoryCategory(file.category) === selectedCategory
                        )
                        .map((file) => (

                        <div
                            className="repository-card"
                            key={file._id}
                            id={`repository-file-${file._id}`}
                        >

                            {/* CARD HEADER */}

                            <div className="repository-card-header">

                                <h3>
                                    {file.title}
                                </h3>

                                <span className="repository-file-type">
                                    DOCUMENT
                                </span>

                            </div>


                            {/* DESCRIPTION */}

                            <p className="repository-description">

                                {file.description ||
                                    "No description available."}

                            </p>


                            {/* DETAILS */}

                            <div className="repository-details">


                                {/* SESSION */}

                                <div className="repository-detail">

                                    <span>
                                        SESSION
                                    </span>

                                    <strong>
                                        {file.session}
                                    </strong>

                                </div>


                                {/* EVEN / ODD */}

                                <div className="repository-detail">

                                    <span>
                                        TERM
                                    </span>

                                    <strong>
                                        {file.term}
                                    </strong>

                                </div>


                                {/* CATEGORY */}

                                <div className="repository-detail">

                                    <span>
                                        CATEGORY
                                    </span>

                                    <strong>
                                        {file.category}
                                    </strong>

                                </div>


                                {/* UPLOADED BY */}

                                <div className="repository-detail">

                                    <span>
                                        UPLOADED BY
                                    </span>

                                    <strong>
                                        {file.uploadedBy?.name ||
                                            "Faculty"}
                                    </strong>

                                </div>

                            </div>


                            {/* =========================
                                OPEN BUTTON
                            ========================= */}

                            <button
                                className="repository-open"
                                onClick={() =>
                                    handleOpenFile(file.fileUrl)
                                }
                            >
                                Open
                            </button>
                            {/* =========================
                                EDIT BUTTON
                            ========================= */}

                            <button
                                className="repository-edit"
                                onClick={() =>
                                    setEditingFile(file)
                                }
                            >
                                Edit
                            </button>

                            {/* =========================
                                DELETE BUTTON
                            ========================= */}

                            <button
                                className="repository-delete"
                                onClick={() =>
                                    handleDelete(file._id)
                                }
                            >
                                Delete
                            </button>


                           


                            {/* =========================
                                EDIT FORM
                            ========================= */}

                            {editingFile &&
                                editingFile._id === file._id && (

                                <div className="repository-edit-form">

                                    <input
                                        type="text"
                                        value={
                                            editingFile.title
                                        }
                                        onChange={(e) =>
                                            setEditingFile({
                                                ...editingFile,
                                                title:
                                                    e.target.value,
                                            })
                                        }
                                    />


                                    <input
                                        type="text"
                                        value={
                                            editingFile.description ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setEditingFile({
                                                ...editingFile,
                                                description:
                                                    e.target.value,
                                            })
                                        }
                                    />


                                    <button
                                        onClick={handleUpdate}
                                    >
                                        Save
                                    </button>


                                    <button
                                        onClick={() =>
                                            setEditingFile(null)
                                        }
                                    >
                                        Cancel
                                    </button>

                                </div>

                            )}

                        </div>

                    ))}

                </div>

           )
        )}
        </div>
         
    );
};


export default Repository;