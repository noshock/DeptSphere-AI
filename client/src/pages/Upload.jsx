import { useSearchParams, useNavigate } from "react-router-dom";

const Upload = () => {
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const semester = searchParams.get("semester");

    return (
        <div className="dashboard-content">

            <h1>Upload Document</h1>

            {semester && (
                <p>Semester {semester}</p>
            )}

            <div className="upload-options">

               <button
                   type="button"
                   onClick={() =>
                       navigate(`/upload/write?semester=${semester}`)
                   }
               >
                   ✍️ Write Content
               </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate(`/upload/image?semester=${semester}`)
                    }
                >
                    🖼️ Select Image
                </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate(`/upload/merge?semester=${semester}`)
                    }
                >
                    🔗 Merge
                </button>

            </div>

        </div>
    );
};

export default Upload;