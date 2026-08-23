import { useSearchParams } from "react-router-dom";

const StudentForumAI = () => {
    const [searchParams] = useSearchParams();

    const semester = searchParams.get("semester");

    return (
        <div className="student-forum-ai-page">

            <div className="student-forum-ai-header">
                <span className="page-badge">
                    STUDENT FORUM — D.50
                </span>

                <h1>Student Forum AI</h1>

                <p>
                    Create and manage Student Forum documents
                    using AI.
                </p>

                {semester && (
                    <div className="semester-badge">
                        Semester {semester}
                    </div>
                )}
            </div>

            <div className="student-forum-ai-options">

                <div className="ai-option-card">
                    <h2>Create New Document</h2>

                    <p>
                        Generate a Student Forum document
                        using an AI prompt.
                    </p>

                    <button className="primary-button">
                        Create Document
                    </button>
                </div>

                <div className="ai-option-card">
                    <h2>Upload Document</h2>

                    <p>
                        Upload an existing Student Forum
                        document and use AI with it.
                    </p>

                  <button
                      className="primary-button"
                      onClick={() =>
                          window.location.href = `/student-forum-ai/create?semester=${semester}`
                      }
                  >
                      Create Document
                  </button>
                </div>

            </div>

        </div>
    );
};

export default StudentForumAI;