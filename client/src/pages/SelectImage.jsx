import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

const SelectImage = () => {
    const [searchParams] = useSearchParams();
    const semester = searchParams.get("semester");

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
    if (!selectedImage) {
        alert("Please select an image first.");
        return;
    }

    try {
        setIsSaving(true);

        const data = new FormData();

        data.append("title", selectedImage.file.name);
        data.append("description", "Image document");
        data.append("subject", "General");
        data.append("department", "Information Technology");
        data.append("semester", semester);
        data.append("category", "Other");
        data.append("file", selectedImage.file);

        await api.post("/repository/upload", data);

        alert("Image saved to Repository successfully.");

    } catch (error) {
        console.error("Save to Repository error:", error);

        alert(
            error.response?.data?.message ||
            "Image could not be saved."
        );
    } finally {
        setIsSaving(false);
    }
 };

    return (
        <div className="select-image-page">

            <div className="select-image-header">
                <div>
                    <span className="page-badge">
                        DOCUMENT CREATOR
                    </span>

                    <h1>Select Image</h1>

                    <p>
                        Select an image for Semester {semester}.
                    </p>
                </div>

                <div className="semester-badge">
                    Semester {semester}
                </div>
            </div>

            <div className="image-upload-card">

                <h2>Choose Image</h2>

                <p>
                    Select an image from your computer.
                </p>

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
                    <div className="image-preview">

                        <h3>Selected Image</h3>

                        <img
                            src={selectedImage.preview}
                            alt="Selected"
                        />

                        <p>
                            {selectedImage.file.name}
                        </p>

                         <button
                             type="button"
                             className="primary-button image-preview-button"
                             onClick={handleSaveToRepository}
                             disabled={isSaving}
                         >
                             {isSaving ? "Saving..." : "Save to Repository"}
                         </button>

                    </div>
                )}

            </div>

            {showPreview && selectedImage && (
                <div className="document-preview">

                    <div className="preview-header">
                        <div>
                            <h2>Image Preview</h2>
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

                    <div className="preview-paper image-document-preview">

                        <h2>Document Preview</h2>

                        <img
                            src={selectedImage.preview}
                            alt="Document Preview"
                        />

                    </div>

                </div>
            )}

        </div>
    );
};

export default SelectImage;