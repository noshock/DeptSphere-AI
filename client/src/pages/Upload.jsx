import { useSearchParams, useNavigate } from "react-router-dom";

const Upload = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const session = searchParams.get("session");
    const term = searchParams.get("term");
    const source = searchParams.get("source");

    return (
        <div className="dashboard-content">

            <h1>Upload Document</h1>

            {session && (
                <p>
                    Session {session}
                    {term && ` — ${term}`}
                </p>
            )}

            <div className="upload-options">

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/upload/write?session=${encodeURIComponent(
                                session
                            )}&term=${encodeURIComponent(term)}`
                        )
                    }
                >
                    ✍️ Write Content
                </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/upload/image?session=${encodeURIComponent(
                                session
                            )}&term=${encodeURIComponent(term)}`
                        )
                    }
                >
                    🖼️ Select Image
                </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            `/upload/merge?session=${encodeURIComponent(
                                session
                            )}&term=${encodeURIComponent(term)}`
                        )
                    }
                >
                    🔗 Merge
                </button>

                {source === "student-forum" && (
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/student-forum-ai/upload?session=${encodeURIComponent(
                                    session
                                )}&term=${encodeURIComponent(term)}`
                            )
                        }
                    >
                        🤖 Upload & Edit with AI
                    </button>
                )}

            </div>

        </div>
    );
};

export default Upload;