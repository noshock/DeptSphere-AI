import { useLocation, useSearchParams, useNavigate, } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

const StudentForumAIEditUpload = () => {
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

    const semester = searchParams.get("semester");
    const session = searchParams.get("session");
    const term = searchParams.get("term");
    
    const file = location.state?.file;

    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [editedContent, setEditedContent] = useState("");
    
    const [image, setImage] = useState(null);

   const handleEditWithAI = async () => {
        if (!file) {
            setError("No document selected.");
            return;
        }
    
        if (!prompt.trim()) {
            setError("Please tell the AI what you want to change.");
            return;
        }
    
        try {
            setLoading(true);
            setError("");
    
            const formData = new FormData();
    
            formData.append("file", file);
            formData.append("prompt", prompt);
            formData.append("session", session);
            formData.append("term", term);
            
            if (image) {
                formData.append("image", image);
            }
    
            const response = await api.post(
                "/student-forum-ai/edit-upload",
                formData
            );
    
            console.log(
                "AI EDIT RESPONSE:",
                response.data
            );
    
            setEditedContent(response.data.content);
    
        } catch (error) {
            console.error(
                "AI upload edit error:",
                error
            );
    
            setError(
                error.response?.data?.message ||
                "Failed to edit document with AI."
            );
    
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="student-forum-ai-create">

            <div className="student-forum-ai-header">

                <span className="page-badge">
                    STUDENT FORUM — D.50
                </span>

                <h1>Edit Student Forum Document with AI</h1>

                <p>
                    Tell the AI what you want to change in your document.
                </p>

                {(semester || session || term) && (
                    <div className="semester-badge">
                        {semester && `Semester ${semester}`}
                        {session && ` — Session ${session}`}
                        {term && ` — ${term}`}
                    </div>
                )}

            </div>

            <div className="ai-prompt-card">

                <h2>Uploaded Document</h2>

                {file ? (
                    <p>
                        Selected file: <strong>{file.name}</strong>
                    </p>
                ) : (
                    <p className="ai-error">
                        No document was selected.
                    </p>
                )}
                <div className="image-upload-section">
                
                    <label className="image-upload-button">
                        🖼️ Add Image
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={(e) => {
                                const selectedImage = e.target.files[0];
                
                                if (selectedImage) {
                                    setImage(selectedImage);
                                }
                            }}
                            hidden
                        />
                    </label>
                
                    <span className="image-optional">
                        Optional
                    </span>
                
                    {image && (
                        <div className="selected-image">
                
                            <img
                                src={URL.createObjectURL(image)}
                                alt="Selected"
                            />
                
                            <div className="selected-image-info">
                                <strong>{image.name}</strong>
                
                                <button
                                    type="button"
                                    className="remove-image-button"
                                    onClick={() => setImage(null)}
                                >
                                    Remove
                                </button>
                            </div>
                
                        </div>
                    )}
                
                </div>

                <h2>What do you want to change?</h2>

                <p>
                    Give the AI instructions for editing this document.
                </p>

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: Change the holiday date to 15 September 2026..."
                />

                <button
                    type="button"
                    className="primary-button"
                    onClick={handleEditWithAI} 
                >
                    {loading ? "Editing..." : "Edit with AI"}
                </button>

                {error && (
                    <p className="ai-error">
                        {error}
                    </p>
                )}
                
                {editedContent && (
                    <div className="ai-generated-content">
                        <h2>AI Edited Document</h2>
                
                        <textarea
                            className="generated-document-editor"
                            value={editedContent}
                            onChange={(e) =>
                                setEditedContent(e.target.value)
                            }
                        />

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() => {
                                if (image) {
                                    const reader = new FileReader();
                        
                                    reader.onloadend = () => {
                                        navigate(
                                            `/student-forum-ai/preview?semester=${semester}&session=${session}&term=${term}`,
                                            {
                                                state: {
                                                    content: editedContent,
                                                    semester,
                                                    session,
                                                    term,
                                                    imageData: reader.result,
                                                },
                                            }
                                        );
                                    };
                        
                                    reader.readAsDataURL(image);
                                } else {
                                    navigate(
                                        `/student-forum-ai/preview?semester=${semester}&session=${session}&term=${term}`,
                                        {
                                            state: {
                                                content: editedContent,
                                                semester,
                                                session,
                                                term,
                                                imageData: null,
                                            },
                                        }
                                    );
                                }
                            }}
                        >
                            Preview Document
                        </button>
                    </div>
                )}

            </div>

        </div>
    );
};

export default StudentForumAIEditUpload;