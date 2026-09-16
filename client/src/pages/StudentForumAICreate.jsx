import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../services/api";

const StudentForumAICreate = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    const session =
        searchParams.get("session") || location.state?.session;

    const term =
      searchParams.get("term") ||
      location.state?.term;

    const normalizedTerm =
        term
            ? term.charAt(0).toUpperCase() +
              term.slice(1).toLowerCase()
            : "";

   const [prompt, setPrompt] = useState("");
   const [generatedContent, setGeneratedContent] = useState("");
   const [issueDate, setIssueDate] = useState("");
   const [referenceNumber, setReferenceNumber] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   
   const referenceRequestStarted = useRef(false);
   
   const [image, setImage] = useState(null);
   const [existingImageData, setExistingImageData] = useState(null);
   const [generatedTitle, setGeneratedTitle] = useState("");
   const [generatedCategory, setGeneratedCategory] = useState("");
   const [documentType, setDocumentType] = useState("Notice");

   useEffect(() => {
    const fetchReferenceNumber = async () => {
        // Don't request another number if we already have one
        if (referenceRequestStarted.current) {
            return;
        }

        // If coming back from Preview, keep the existing number
        if (location.state?.referenceNumber) {
            setReferenceNumber(location.state.referenceNumber);
            return;
        }

        // If a saved draft already has a number, keep it
        const savedData = sessionStorage.getItem(
            "studentForumDraft"
        );

        if (savedData) {
            try {
                const data = JSON.parse(savedData);

                if (data.referenceNumber) {
                    setReferenceNumber(data.referenceNumber);
                    return;
                }
            } catch (error) {
                console.error(
                    "Error reading saved draft:",
                    error
                );
            }
        }

        referenceRequestStarted.current = true;

        try {
            const response = await api.get(
                "/student-forum-ai/next-reference"
            );

            setReferenceNumber(
                response.data.referenceNumber
            );
        } catch (error) {
            console.error(
                "Failed to fetch reference number:",
                error
            );
        }
    };

    fetchReferenceNumber();
}, [location.state]);


useEffect(() => {
    // Coming back from Preview
if (location.state?.content) {
    setGeneratedContent(location.state.content);
    setGeneratedTitle(location.state.title || "");
    setGeneratedCategory(location.state.category || "");
    setPrompt(location.state.prompt || "");
    setIssueDate(location.state.issueDate || "");
    setReferenceNumber(location.state.referenceNumber || "");
    setExistingImageData(location.state.imageData || null);
    return;
}

    // Load saved draft
    const savedData = sessionStorage.getItem(
        "studentForumDraft"
    );

    if (savedData) {
        try {
            const data = JSON.parse(savedData);

            setPrompt(data.prompt || "");
setGeneratedContent(data.generatedContent || "");
setGeneratedTitle(data.generatedTitle || "");
setGeneratedCategory(data.generatedCategory || "");
setIssueDate(data.issueDate || "");
setReferenceNumber(data.referenceNumber || "");
        } catch (error) {
            console.error(
                "Error loading saved draft:",
                error
            );

            sessionStorage.removeItem(
                "studentForumDraft"
            );
        }
    }
}, [location.state]);


    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Please enter a prompt.");
            return;
        }

        if (!session || !normalizedTerm) {
            setError("Session and term are required.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await api.post(
                "/student-forum-ai/generate",
                {
                    prompt,
                    session,
                    term: normalizedTerm,
                }
            );

            console.log(
                "AI RESPONSE:",
                response.data
            );

            setGeneratedContent(
                response.data.content
            );
            
            setGeneratedTitle(
                response.data.title
            );
            
            setGeneratedCategory(
                response.data.category
            );

            const dateMatch = prompt.match(
                /\b(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\b/i
            );
            
            let extractedIssueDate = "";
            
            if (dateMatch) {
                const day = parseInt(dateMatch[1], 10);
                const monthText = dateMatch[2].toLowerCase();
            
                const months = {
                    jan: "January",
                    january: "January",
                    feb: "February",
                    february: "February",
                    mar: "March",
                    march: "March",
                    apr: "April",
                    april: "April",
                    may: "May",
                    jun: "June",
                    june: "June",
                    jul: "July",
                    july: "July",
                    aug: "August",
                    august: "August",
                    sep: "September",
                    sept: "September",
                    september: "September",
                    oct: "October",
                    october: "October",
                    nov: "November",
                    november: "November",
                    dec: "December",
                    december: "December",
                };
            
                extractedIssueDate =
                    `${day} ${months[monthText]} ${new Date().getFullYear()}`;
            }
            
            setIssueDate(extractedIssueDate);

            // Save draft
            sessionStorage.setItem(
                "studentForumDraft",
                JSON.stringify({
                    prompt,
                    generatedContent: response.data.content,
                    generatedTitle: response.data.title,
                    generatedCategory: response.data.category,
                    session,
                    term,
                    issueDate: extractedIssueDate,
                    referenceNumber,
                })
            );
        } catch (error) {
            console.error(
                "AI generation error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Failed to generate document."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="student-forum-ai-create">

            {/* HEADER */}

            <div className="student-forum-ai-header">

                <span className="page-badge">
                    STUDENT FORUM — D.50
                </span>

                <h1>
                    Create Student Forum Document
                </h1>

                <p>
                    Describe what document you want
                    the AI to create.
                </p>

                {session && term && (
                    <div className="semester-badge">
                        Session {session} — {term}
                    </div>
                )}

            </div>


            {/* PROMPT */}

            <div className="ai-prompt-card">

                <h2>
                    What do you want to create?
                </h2>

                <p>
                    Give the AI instructions for your
                    Student Forum document.
                </p>
                <div className="document-type-section">
                    <label htmlFor="documentType">
                        Document Type
                    </label>
                
                    <select
                        id="documentType"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                    >
                        <option value="Notice">Notice</option>
                        <option value="Report">Report</option>
                        <option value="Application">Application</option>
                        <option value="Circular">Circular</option>
                    </select>
                </div>

                <textarea
                    value={prompt}
                    onChange={(e) =>
                        setPrompt(e.target.value)
                    }
                    placeholder="Example: Create a notice for the Student Forum election..."
                />

                <button
                    className="primary-button"
                    type="button"
                    onClick={handleGenerate}
                    disabled={loading}
                >
                    {loading
                        ? "Generating..."
                        : "Generate Document"}
                </button>

                {error && (
                    <p className="ai-error">
                        {error}
                    </p>
                )}

            </div>


            {/* GENERATED DOCUMENT */}

            {generatedContent && (
                <div className="ai-generated-content">

                    <h2>
                        Generated Document
                    </h2>

<textarea
    className="generated-document-editor"
    value={generatedContent}
    onChange={(e) =>
        setGeneratedContent(e.target.value)
    }
/>

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

<div className="generated-document-actions">

    <button
        type="button"
        className="primary-button"
        onClick={() => {
if (image) {
    const reader = new FileReader();

    reader.onloadend = () => {
        navigate("/student-forum-ai/preview", {
            state: {
                content: generatedContent,
                title: generatedTitle,
                category: generatedCategory,
                documentType,
                session,
                term,
                prompt,
                issueDate,
                referenceNumber,
                imageData: reader.result,
            },
        });
    };

    reader.readAsDataURL(image);
} else {
                navigate(
                    "/student-forum-ai/preview",
                    {
                        state: {
                            content: generatedContent,
                            title: generatedTitle,
                            category: generatedCategory,
                            documentType,
                            session,
                            term,
                            prompt,
                            issueDate,
                            referenceNumber,
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

                </div>
            )}

        </div>
    );
};

export default StudentForumAICreate;