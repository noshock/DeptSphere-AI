import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const StudentForumAIUpload = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const semester = searchParams.get("semester");

    const [file, setFile] = useState(null);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            return;
        }

        setFile(selectedFile);
        setError("");
    };

    const handleContinue = () => {
        if (!file) {
            setError("Please select a document first.");
            return;
        }

        navigate(
            `/student-forum-ai/edit-upload?semester=${semester}`,
            {
                state: {
                    file,
                },
            }
        );
    };

    return (
        <div className="student-forum-ai-upload">

            <div className="student-forum-ai-header">

                <span className="page-badge">
                    STUDENT FORUM — D.50
                </span>

                <h1>Upload Student Forum Document</h1>

                <p>
                    Upload an existing Student Forum document
                    and edit it using AI.
                </p>

                {semester && (
                    <div className="semester-badge">
                        Semester {semester}
                    </div>
                )}

            </div>

            <div className="ai-prompt-card">

                <h2>Select Document</h2>

                <p>
                    Choose the document you want to edit with AI.
                </p>

                <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                />

                {file && (
                    <p>
                        Selected: <strong>{file.name}</strong>
                    </p>
                )}

                {error && (
                    <p className="ai-error">
                        {error}
                    </p>
                )}

                <button
                    type="button"
                    className="primary-button"
                    onClick={handleContinue}
                >
                    Continue with AI
                </button>

            </div>

        </div>
    );
};

export default StudentForumAIUpload;