import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

const Merge = () => {
    const [searchParams] = useSearchParams();
    const semester = searchParams.get("semester");

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setSelectedImage({
                file,
                preview: URL.createObjectURL(file),
            });

            setShowPreview(false);
        }
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

    if (!selectedImage) {
        alert("Please select an image.");
        return;
    }

    try {
        setIsSaving(true);

        const mergedContent = `
Title: ${title}

${content}

Image: ${selectedImage.file.name}
`;

        const textFile = new File(
            [mergedContent],
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

        alert("Merged document saved to Repository successfully.");

    } catch (error) {
        console.error("Save to Repository error:", error);

        alert(
            error.response?.data?.message ||
            error.message ||
            "Merged document could not be saved."
        );
    } finally {
        setIsSaving(false);
    }
 };

    return (
        <div className="merge-page">

            <div className="merge-header">
                <div>
                    <span className="page-badge">
                        DOCUMENT CREATOR
                    </span>

                    <h1>Merge Document</h1>

                    <p>
                        Combine written content and an image
                        for Semester {semester}.
                    </p>
                </div>

                <div className="semester-badge">
                    Semester {semester}
                </div>
            </div>

            <div className="merge-editor">

                <div className="merge-section">

                    <h2>Document Information</h2>

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

                <div className="merge-section">

                    <h2>Write Content</h2>

                    <textarea
                        className="document-textarea"
                        placeholder="Write your document content here..."
                        value={content}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                    />

                </div>

                <div className="merge-section">

                    <h2>Select Image</h2>

                    <label className="image-select-button">
                        Select Image

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            hidden
                        />
                    </label>

                    {selectedImage && (
                        <div className="merge-image-preview">

                            <img
                                src={selectedImage.preview}
                                alt="Selected"
                            />

                            <p>
                                {selectedImage.file.name}
                            </p>

                        </div>
                    )}

                </div>

                <div className="merge-footer">

                    <div>
                        <strong>Document Format</strong>

                        <p>
                            Content and image will be combined
                            into one document.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => setShowPreview(true)}
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
                            onClick={() => setShowPreview(false)}
                        >
                            Close
                        </button>

                    </div>

                    <div className="preview-paper">

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
                                    No content entered.
                                </p>
                            )}

                        </div>

                        {selectedImage && (
                            <img
                                className="merge-preview-image"
                                src={selectedImage.preview}
                                alt="Merged document"
                            />
                        )}

                    </div>

                </div>
            )}

        </div>
    );
};

export default Merge;