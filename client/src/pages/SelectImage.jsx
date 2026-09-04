import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

const SelectImage = () => {
    const [searchParams] = useSearchParams();
    const session = searchParams.get("session");
    const term = searchParams.get("term");

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

    if (!session || !term) {
        alert("Session and term are required.");
        return;
    }

    try {
        setIsSaving(true);

        const imageElement = document.querySelector(
            ".image-document-preview img"
        );

        if (!imageElement) {
            alert("Image preview not found.");
            return;
        }

        const canvas = await html2canvas(imageElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
        });

        pdf.addImage(
            imgData,
            "PNG",
            0,
            0,
            210,
            297
        );

        const pdfBlob = pdf.output("blob");

        const pdfFile = new File(
            [pdfBlob],
            `${selectedImage.file.name}.pdf`,
            {
                type: "application/pdf",
            }
        );

        const data = new FormData();

        data.append(
            "title",
            selectedImage.file.name
        );
        data.append(
            "description",
            "Image document"
        );
        data.append(
            "subject",
            "General"
        );
        data.append(
            "department",
            "Information Technology"
        );
        data.append(
            "session",
            session
        );
        data.append(
            "term",
            term
        );
        data.append(
            "category",
            "Other"
        );
        data.append(
            "file",
            pdfFile
        );

        await api.post(
            "/repository/upload",
            data
        );

        alert(
            "PDF saved to Repository successfully."
        );

    } catch (error) {
        console.error(
            "Save to Repository error:",
            error
        );

        alert(
            error.response?.data?.message ||
            error.message ||
            "PDF could not be saved."
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
                        Select an image for Session {session} — {term}.
                    </p>
                </div>

                <div className="semester-badge">
                    {session} — {term}
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
                                <span>
                                    Session {session} — {term}
                                </span>
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