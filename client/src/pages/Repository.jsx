import { useEffect, useState } from "react";
import api from "../services/api";

const Repository = () => {
    const [files, setFiles] = useState([]);

    const [search, setSearch] = useState("");

    const [semester, setSemester] = useState("");

    const [editingFile, setEditingFile] = useState(null);


    const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    department: "",
    semester: "",
    category: "",
    file: null,
   });

   const handleSearch = async () => {
    try {
        if (!search.trim()) {
            const response = await api.get("/repository");
            setFiles(response.data);
            return;
        }

        const response = await api.get(
            `/repository/search?title=${search}`
        );

        setFiles(response.data);
    } catch (error) {
        console.error("Search error:", error);
    }
 };

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


    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await api.get("/repository");
                setFiles(response.data);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };

        fetchFiles();
    }, []);

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
        <div>
            <h1>Repository</h1>
            <input
                 type="text"
                 placeholder="Search by title..."
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
                />

                <button onClick={handleSearch}>
                   Search
                </button>

        <select
             value={semester}
             onChange={(e) => setSemester(e.target.value)}
             >
              <option value="">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
        </select>
        <button onClick={handleSemesterFilter}>
               Filter
        </button>
            <h2>Upload Document</h2>

 <form onSubmit={handleSubmit}>
    <input
    type="text"
    name="title"
    placeholder="Title"
    value={formData.title}
    onChange={(e) =>
        setFormData({
            ...formData,
            title: e.target.value,
        })
    }
 />

    <input
    type="text"
    name="description"
    placeholder="Description"
    value={formData.description}
    onChange={(e) =>
        setFormData({
            ...formData,
            description: e.target.value,
        })
    }
 />

   <input
    type="text"
    name="subject"
    placeholder="Subject"
    value={formData.subject}
    onChange={(e) =>
        setFormData({
            ...formData,
            subject: e.target.value,
        })
    }
 />

   <input
    type="text"
    name="department"
    placeholder="Department"
    value={formData.department}
    onChange={(e) =>
        setFormData({
            ...formData,
            department: e.target.value,
        })
    }
 />

    <input
    type="number"
    name="semester"
    placeholder="Semester"
    value={formData.semester}
    onChange={(e) =>
        setFormData({
            ...formData,
            semester: e.target.value,
        })
    }
 />

    <select
    name="category"
    value={formData.category}
    onChange={(e) =>
        setFormData({
            ...formData,
            category: e.target.value,
        })
    }
 >
    <option value="">Select Category</option>
    <option value="Notes">Notes</option>
    <option value="Question Paper">Question Paper</option>
    <option value="Lab Manual">Lab Manual</option>
    <option value="Assignment">Assignment</option>
    <option value="PPT">PPT</option>
    <option value="Syllabus">Syllabus</option>
    <option value="E-Book">E-Book</option>
    <option value="Other">Other</option>
  </select>

    <input
    type="file"
    name="file"
    onChange={(e) =>
        setFormData({
            ...formData,
            file: e.target.files[0],
        })
    }
 />

    <button type="submit">Upload</button>
   </form>

            {files.length === 0 ? (
                <p>No documents found.</p>
            ) : (
                <div>
                    {files.map((file) => (
                        <div key={file._id}>
                            <h3>{file.title}</h3>
                            <p>{file.description}</p>
                            <p>Subject: {file.subject}</p>
                            <p>Semester: {file.semester}</p>
                            <p>Category: {file.category}</p>
                            <button
                                onClick={() =>
                                window.open(
                                `http://localhost:5000/${file.fileUrl.replace(/\\/g, "/")}`,
                                "_blank"
                                )
                               }
                              >
                              Open
                            </button>
                           <button onClick={() => handleDelete(file._id)}>
                                  Delete
                           </button>
                           <button onClick={() => setEditingFile(file)}>
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