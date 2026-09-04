import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        // Coming back from Preview
        if (location.state?.content) {
            setGeneratedContent(location.state.content);
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
                setGeneratedContent(
                    data.generatedContent || ""
                );
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

            // Save draft
            sessionStorage.setItem(
                "studentForumDraft",
                JSON.stringify({
                    prompt,
                    generatedContent:
                        response.data.content,
                    session,
                    term,
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
                            setGeneratedContent(
                                e.target.value
                            )
                        }
                    />

                    <div className="generated-document-actions">

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() =>
                                navigate(
                                    "/student-forum-ai/preview",
                                    {
                                        state: {
                                            content:
                                                generatedContent,
                                            session,
                                            term,
                                        },
                                    }
                                )
                            }
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