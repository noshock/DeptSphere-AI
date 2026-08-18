import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

const Repository = () => {
    const [files, setFiles] = useState([]);

    const [search, setSearch] = useState("");

    const [semester, setSemester] = useState("");

    const [editingFile, setEditingFile] = useState(null);

    const [searchParams] = useSearchParams();
    const selectedSemester = searchParams.get("semester");

 const handleSemesterFilter = async () => {
    try {
        if (!semester) {
            const response = await api.get("/repository");
            setFiles(response.data);
            return;
        }

        const response = await api.get(
            `/repository/filter/semester?semester=${semester}`
        );

        setFiles(response.data);
    } catch (error) {
        console.error("Semester filter error:", error);
    }
 };

 const handleDelete = async (id) => {
    try {
        await api.delete(`/repository/${id}`);

        const response = await api.get("/repository");
        setFiles(response.data);

        alert("File deleted successfully");
    } catch (error) {
        console.error("Delete error:", error);
        alert("File deletion failed");
    } 
 }; 
 const handleUpdate = async () => {
    try {
        await api.put(`/repository/${editingFile._id}`, {
            title: editingFile.title,
            description: editingFile.description,
        });

        const response = await api.get("/repository");
        setFiles(response.data);

        setEditingFile(null);

        alert("File updated successfully");
    } catch (error) {
        console.error("Update error:", error);
        alert("File update failed");
    }
 };

 const handleSearch = async () => {
    try {
        if (!search.trim()) {
            const response = selectedSemester
                ? await api.get(
                    `/repository/filter/semester?semester=${selectedSemester}`
                )
                : await api.get("/repository");

            setFiles(response.data);
            return;
        }

        const response = await api.get(
            `/repository/search?title=${search}`
        );

        setFiles(
            selectedSemester
                ? response.data.filter(
                    (file) =>
                        String(file.semester) ===
                        String(selectedSemester)
                )
                : response.data
        );

    } catch (error) {
        console.error("Search error:", error);
    }
};


    useEffect(() => {
    const fetchFiles = async () => {
        try {
            let response;

            if (selectedSemester) {
                response = await api.get(
                    `/repository/filter/semester?semester=${selectedSemester}`
                );
            } else {
                response = await api.get("/repository");
            }

            setFiles(response.data);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    fetchFiles();
 }, [selectedSemester]);

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const data = new FormData();

        data.append("title", formData.title);
        data.append("description", formData.description);
        data.append("subject", formData.subject);
        data.append("department", formData.department);
        data.append("semester", formData.semester);
        data.append("category", formData.category);
        data.append("file", formData.file);

        const response = await api.post("/repository/upload", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log(response.data);

        alert("File uploaded successfully");

        const responseFiles = await api.get("/repository");
        setFiles(responseFiles.data);

    } catch (error) {
        console.error("Upload error:", error);
        alert("File upload failed");
    }
 };

    return (
        <div className="repository-page">
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
             
                 {selectedSemester && (
                     <div className="repository-semester">
                         Semester {selectedSemester}
                     </div>
                 )}
             </div>
             
             <div className="repository-toolbar">
                 <input
                     className="repository-search"
                     type="text"
                     placeholder="Search documents by title..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                 />
             
                 <button
                     className="repository-search-button"
                     onClick={handleSearch}
                 >
                     Search
                 </button>
             </div>

                {files.length === 0 ? (
                    <div className="repository-empty">
                        <h3>No documents found</h3>
                        <p>
                            There are no documents available for this semester yet.
                        </p>
                    </div>
                ) : (
                <div className="repository-list">
                    {files.map((file) => (
                 <div
                    className="repository-card"
                      key={file._id}
                  >
                            <div className="repository-card-header">
                                   <h3>{file.title}</h3>
                               
                                   <span className="repository-file-type">
                                       DOCUMENT
                                   </span>
                               </div>
                               
                               <p className="repository-description">
                                   {file.description || "No description available."}
                               </p>
                               
                               <div className="repository-details">
                               
                                   <div className="repository-detail">
                                       <span>SEMESTER</span>
                                       <strong>{file.semester}</strong>
                                   </div>
                               
                                   <div className="repository-detail">
                                       <span>UPLOADED BY</span>
                                       <strong>
                                           {file.uploadedBy?.name || "Faculty"}
                                       </strong>
                                   </div>
                               
                               </div>
                             <button
                                 className="repository-open"
                                 onClick={() =>
                                     window.open(
                                         `http://localhost:5000/${file.fileUrl.replace(/\\/g, "/")}`,
                                         "_blank"
                                     )
                                 }
                             >
                                 Open
                             </button>
                             
                             <button
                                 className="repository-delete"
                                 onClick={() => handleDelete(file._id)}
                             >
                                 Delete
                             </button>
                             
                             <button
                                 className="repository-edit"
                                 onClick={() => setEditingFile(file)}
                             >
                                 Edit
                             </button>
                           {editingFile && editingFile._id === file._id && (
                                    <div>
                                    <input
                                      type="text"
                                      value={editingFile.title}
                                      onChange={(e) =>
                                      setEditingFile({
                                      ...editingFile,
                                      title: e.target.value,
                                    })
                                }
                             />

                                     <input
                                       type="text"
                                       value={editingFile.description || ""}
                                       onChange={(e) =>
                                       setEditingFile({
                                       ...editingFile,
                                       description: e.target.value,
                                    })
                                }
                            />

                            <button onClick={handleUpdate}>
                                Save
                            </button>

                            <button onClick={() => setEditingFile(null)}>
                                 Cancel
                            </button>
                           </div>
                           )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};


export default Repository;