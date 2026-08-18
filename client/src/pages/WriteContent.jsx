import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

const WriteContent = () => {
    const [searchParams] = useSearchParams();

    const semester = searchParams.get("semester");

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handlePreview = () => {
      console.log("Preview button clicked");
      setShowPreview(true);
    };

  const handleSaveToRepository = async () => {
    if (!title.trim()) {
        alert("Please enter a document title.");
        return;
    }

    if (!content.trim()) {
        alert("Please write some content.");
        return;
    }

    try {
        setIsSaving(true);

        const textFile = new File(
            [content],
            `${title}.txt`,
            { type: "text/plain" }
        );

        const data = new FormData();

        data.append("title", title);
        data.append("description", content);
        data.append("subject", "General");
        data.append("department", "Information Technology");
        data.append("semester", semester);
        data.append("category", "Other");
        data.append("file", textFile);

        await api.post("/repository/upload", data);

        alert("Document saved to Repository successfully.");

   }  catch (error) {
      console.error("Save to Repository error:", error);

      console.log("Status:", error.response?.status);
     console.log("Response:", error.response?.data);
      console.log("Error:", error.message);

      alert(
          error.response?.data?.message ||
          error.message ||
          "Document could not be saved."
      );
   } finally {
        setIsSaving(false);
    }
 };

    return (
        <div className="write-content-page">

            <div className="write-content-header">
                <div>
                    <span className="page-badge">
                        DOCUMENT CREATOR
                    </span>

                    <h1>Create Document</h1>

                    <p>
                        Prepare your document for Semester {semester}.
                    </p>
                </div>

                <div className="semester-badge">
                    Semester {semester}
                </div>
            </div>

            <div className="document-editor">

                <div className="editor-section">

                    <div className="section-title">
                        <div>
                            <h2>Document Information</h2>
                            <span>Enter document details</span>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Document Title</label>

                        <input
                            type="text"
                            placeholder="Enter document title"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                        />
                    </div>

                </div>

                <div className="editor-section">

                    <div className="section-title">
                        <div>
                            <h2>Document Content</h2>
                            <span>Write your content below</span>
                        </div>
                    </div>

                    <textarea
                        className="document-textarea"
                        placeholder="Start writing your document content here..."
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                    />

                </div>

                <div className="editor-footer">

                        <div className="editor-info">
                            <span>📄</span>

                            <div>
                                <strong>Document Format</strong>

                                <p>
                                    Raisoni format will be applied
                                    during generation.
                                </p>
                            </div>
                        </div>

                        <div className="editor-actions">
                            <button
                                type="button"
                                className="primary-button"
                                onClick={handlePreview}
                            >
                                Preview Document
                            </button>

                            <button
                                type="button"
                                className="primary-button"
                                onClick={handleSaveToRepository}
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : "Save to Repository"}
                            </button>
                        </div>

                </div>

            </div>

            {showPreview && (
                <div className="document-preview">

                    <div className="preview-header">
                        <div>
                            <h2>Document Preview</h2>
                            <span>
                                Semester {semester}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setShowPreview(false)
                            }
                        >
                            Close
                        </button>
                    </div>

                    <div className="preview-paper">

                        <div className="preview-institute">
                            <h3>
                                G H Raisoni College
                            </h3>

                            <p>
                                Department of Information Technology
                            </p>
                        </div>

                        <hr />

                        <h1>
                            {title || "Untitled Document"}
                        </h1>

                        <div className="preview-content">
                            {content ? (
                                content
                                    .split("\n")
                                    .map((line, index) => (
                                        <p key={index}>
                                            {line}
                                        </p>
                                    ))
                            ) : (
                                <p className="empty-preview">
                                    No content entered yet.
                                </p>
                            )}
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default WriteContent;