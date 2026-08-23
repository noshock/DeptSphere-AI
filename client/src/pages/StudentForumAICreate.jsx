import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import ReactMarkdown from "react-markdown";

const StudentForumAICreate = () => {

        const [searchParams] = useSearchParams();
        const semester = searchParams.get("semester");

        const [prompt, setPrompt] = useState("");
        const [generatedContent, setGeneratedContent] = useState("");
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState("");

        const handleGenerate = async () => {
            if (!prompt.trim()) {
                setError("Please enter a prompt.");
                return;
            }
        
            try {
                setLoading(true);
                setError("");
        
                const response = await api.post(
                    "/student-forum-ai/generate",
                    {
                        prompt,
                        semester,
                    }
                );

                console.log("AI RESPONSE:", response.data); 
                setGeneratedContent(response.data.content);
                
        
            } catch (error) {
                console.error("AI generation error:", error);
        
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

            <div className="student-forum-ai-header">

                <span className="page-badge">
                    STUDENT FORUM — D.50
                </span>

                <h1>Create Student Forum Document</h1>

                <p>
                    Describe what document you want the AI to create.
                </p>

                {semester && (
                    <div className="semester-badge">
                        Semester {semester}
                    </div>
                )}

            </div>

            <div className="ai-prompt-card">

                <h2>What do you want to create?</h2>

                <p>
                    Give the AI instructions for your Student Forum
                    document.
                </p>

                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: Create a notice for the Student Forum election..."
                />

                <button
                    className="primary-button"
                    type="button"
                    onClick={handleGenerate}
                >
                    {loading ? "Generating..." : "Generate Document"}
                    {error && (
                       <p className="ai-error">
                           {error}
                       </p>
                   )}
                   
                   {generatedContent && (
                       <div className="ai-generated-content">
                           <h2>Generated Document</h2>
                   
                           <div className="generated-document">
                               <ReactMarkdown>{generatedContent}</ReactMarkdown>
                           </div>
                       </div>
                   )}
              </button>

            </div>

        </div>
    );
};

export default StudentForumAICreate;