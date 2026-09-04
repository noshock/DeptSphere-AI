import { useSearchParams, useNavigate } from "react-router-dom";

const StudentForumAI = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const session = searchParams.get("session");
    const term = searchParams.get("term");

    return (
        <div className="student-forum-ai-page">

            <div className="student-forum-ai-header">

                <span className="page-badge">
                    STUDENT FORUM — D.50
                </span>

                <h1>
                    Student Forum AI
                </h1>

                <p>
                    Create and manage Student Forum documents
                    using AI.
                </p>

                {session && term && (
                    <div className="semester-badge">
                        Session {session} — {term}
                    </div>
                )}

            </div>


            <div className="student-forum-ai-options">

                {/* CREATE DOCUMENT */}

                <div className="ai-option-card">

                    <h2>
                        Create New Document
                    </h2>

                    <p>
                        Generate a Student Forum document
                        using an AI prompt.
                    </p>

                    <button
                        className="primary-button"
                        type="button"
                        onClick={() =>
                            navigate(
                                `/student-forum-ai/create?session=${encodeURIComponent(
                                    session || ""
                                )}&term=${encodeURIComponent(
                                    term || ""
                                )}`
                            )
                        }
                    >
                        Create Document
                    </button>

                </div>


                {/* UPLOAD DOCUMENT */}

                <div className="ai-option-card">

                    <h2>
                        Upload Document
                    </h2>

                    <p>
                        Upload an existing Student Forum
                        document and use AI with it.
                    </p>

                    <button
                        className="primary-button"
                        type="button"
                        onClick={() =>
                            navigate(
                                `/student-forum-ai/upload?session=${encodeURIComponent(
                                    session || ""
                                )}&term=${encodeURIComponent(
                                    term || ""
                                )}`
                            )
                        }
                    >
                        Upload Document
                    </button>

                </div>

            </div>

        </div>
    );
};

export default StudentForumAI;