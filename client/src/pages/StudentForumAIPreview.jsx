import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import api from "../services/api";
import { Rnd } from "react-rnd";

const StudentForumAIPreview = () => {
    const location = useLocation();
    const navigate = useNavigate();
const {
    content: rawContent,
    title,
    category,
    documentType,
    session,
    term,
    prompt,
    issueDate,
    referenceNumber: passedReferenceNumber,
    imageData
} = location.state || {};

const content =
    typeof rawContent === "string"
        ? rawContent
        : rawContent?.content || "";

    const [facultyDepartment, setFacultyDepartment] = useState("");
    const [referenceNumber, setReferenceNumber] = useState("");
    const [imageWidth, setImageWidth] = useState(300);
    const [imageHeight, setImageHeight] = useState(200);
    const referenceRequestStarted = useRef(false);
    
const extractDateFromPrompt = (text) => {
    if (!text) return "";

    const match = text.match(
        /\b(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)\b/i
    );

    if (!match) return "";

    const day = parseInt(match[1], 10);
    const monthText = match[2].toLowerCase();

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

    return `${day} ${months[monthText]} ${new Date().getFullYear()}`;
};

const departmentCode =
    facultyDepartment.toLowerCase() === "computer science"
        ? "CS"
        : facultyDepartment.toLowerCase() === "information technology" ||
          facultyDepartment.toLowerCase() === "it"
            ? "IT"
            : facultyDepartment
                .replace(/[^a-zA-Z]/g, "")
                .slice(0, 2)
                .toUpperCase();


    useEffect(() => {
        const fetchFacultyProfile = async () => {
            try {
                const response = await api.get("/faculty/profile");
    
                setFacultyDepartment(response.data.department || "");
            } catch (error) {
                console.error("Failed to fetch faculty profile:", error);
            }
        };
    
        fetchFacultyProfile();
    }, []);

   useEffect(() => {
    const loadReferenceNumber = async () => {
    
        // Prevent duplicate API requests
        if (referenceRequestStarted.current) {
            return;
        }
    
        // Already generated for this document
        if (passedReferenceNumber) {
            setReferenceNumber(passedReferenceNumber);
            return;
        }
    
        referenceRequestStarted.current = true;

        // Check saved draft
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
                    "Error reading saved reference number:",
                    error
                );
            }
        }

        // Generate a new reference number ONLY for a new document
        try {
            const response = await api.get(
                "/student-forum-ai/next-reference"
            );

            const newReferenceNumber =
                response.data.referenceNumber;

            setReferenceNumber(newReferenceNumber);

            // Save it so returning to Preview does not generate another one
            const existingDraft =
                sessionStorage.getItem(
                    "studentForumDraft"
                );

            const draft = existingDraft
                ? JSON.parse(existingDraft)
                : {};

            sessionStorage.setItem(
                "studentForumDraft",
                JSON.stringify({
                    ...draft,
                    referenceNumber: newReferenceNumber,
                })
            );
        } catch (error) {
            console.error(
                "Failed to fetch reference number:",
                error
            );
        }
    };

    loadReferenceNumber();
}, [passedReferenceNumber]);

const updatedContent = content
    // Remove college name from AI-generated content
    .replace(
        /\[COLLEGE NAME\]/gi,
        ""
    )
    .replace(
        /\[(?:NAME OF THE INSTITUTION \/ COLLEGE|COLLEGE \/ INSTITUTION NAME)\]/gi,
        ""
    )

    // Remove department from AI-generated content
    .replace(
        /\[\s*DEPARTMENT\s+NAME\s*\]/gi,
        ""
    )

    // Remove reference number from AI-generated content
    .replace(
        /\[\s*Insert\s+Reference\s+Number\s*\]/gi,
        ""
    )
    .replace(
        /\[INSERT REFERENCE NUMBER\]/gi,
        ""
    )

    // Remove date from AI-generated content
    .replace(
        /\[\s*Insert\s+Date\s+of\s+Issue\s*\]/gi,
        ""
    )
    .replace(
        /\[INSERT DATE OF ISSUE\]/gi,
        ""
    )

    // Remove standalone NOTICE because React will display it separately
    .replace(
        /^\s*NOTICE\s*$/gim,
        ""
    )

    // Remove standalone STUDENT FORUM heading
    .replace(
        /^#{1,6}\s*STUDENT FORUM\s*$/gim,
        ""
    )
    // Remove empty duplicate reference/date metadata
    .replace(
        /Ref\.\s*No\.\s*:\s*Date\s*:/gi,
        ""
    );


    const searchParams = new URLSearchParams(location.search);

    const finalSession =
        session || searchParams.get("session");
    
const rawTerm =
    term || searchParams.get("term");

const finalTerm =
    rawTerm?.trim().toLowerCase() === "even"
        ? "Even"
        : rawTerm?.trim().toLowerCase() === "odd"
            ? "Odd"
            : rawTerm;

    if (!content) {
        return (
            <div className="student-forum-preview">
                <h1>No document to preview</h1>

                <button
                    className="primary-button"
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>
            </div>
        );
    }

const handleBackToEdit = () => {
    navigate("/student-forum-ai/create", {
        state: {
            content,
            title,
            category,
            documentType,
            session: finalSession,
            term: finalTerm,
            prompt,
            issueDate,
            referenceNumber,
            imageData,
        },
    });
};

    const handleDownloadPDF = async () => {
        const element = document.querySelector(".rajsioni-document");
    
        if (!element) return;
    
        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: false,
                backgroundColor: "#ffffff",
                logging: false,
            });
    
            const imgData = canvas.toDataURL("image/png");
    
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });
    
            const pageWidth = 210;
            const pageHeight = 297;
    
            // Put the complete document on ONE A4 page
            pdf.addImage(
                imgData,
                "PNG",
                0,
                0,
                pageWidth,
                pageHeight
            );
    
            pdf.save(`Student_Forum_${session}_${term}.pdf`);
    
        } catch (error) {
            console.error("PDF generation error:", error);
        }
    };

const handleSaveDocument = async () => {

    console.log("PREVIEW STATE:", {
        title,
        category,
        content,
        session: finalSession,
        term: finalTerm,
    });
    
    try {
        if (!finalSession) {
            alert("Session is required");
            return;
        }

        if (!finalTerm) {
            alert("Term is required");
            return;
        }

        if (!referenceNumber) {
            alert("Reference number is not available yet. Please wait.");
            return;
        }

        if (!content) {
            alert("Document content is required");
            return;
        }

        const element = document.querySelector(".rajsioni-document");

        if (!element) {
            alert("Document preview not found");
            return;
        }

        // Convert the Raisoni document preview into an image
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: "#ffffff",
            logging: false,
        });

        const imgData = canvas.toDataURL("image/png");

        // Create PDF
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

        // Convert PDF to Blob
        const pdfBlob = pdf.output("blob");

        // Create FormData
        const formData = new FormData();

        formData.append(
            "file",
            pdfBlob,
            `Student_Forum_${finalSession}_${finalTerm}.pdf`
        );

        formData.append("title", title);

        formData.append("category", category);

        formData.append(
            "subject",
            "Student Forum"
        );

        formData.append(
            "department",
            facultyDepartment
        );

        formData.append(
            "session",
            finalSession
        );

        formData.append(
            "term",
            finalTerm
        );
        
        formData.append(
            "referenceNumber",
            referenceNumber
        );

        console.log("Saving PDF:", {
            title,
            category,
            session: finalSession,
            term: finalTerm,
        });

        const response = await api.post(
            "/student-forum-ai/save",
            formData
        );

        console.log(
            "SAVE RESPONSE:",
            response.data
        );

        if (response.data.success) {
            // Document is now permanently saved.
            // Clear the temporary draft so the next new document
            // receives the next reference number.
            sessionStorage.removeItem("studentForumDraft");
        
            alert(
                "PDF saved successfully to Repository!"
            );
        }

    } catch (error) {
        console.error(
            "Save PDF error:",
            error
        );

        console.error(
            "SERVER RESPONSE:",
            error.response?.data
        );

        alert(
            error.response?.data?.message ||
            "Failed to save PDF."
        );
    }
};

const finalIssueDate =
    issueDate ||
    (() => {
        const savedData = sessionStorage.getItem(
            "studentForumDraft"
        );

        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                return data.issueDate || "";
            } catch {
                return "";
            }
        }

        return "";
})();
    return (
        <div className="student-forum-preview-page">

            {/* TOP TOOLBAR */}
            <div className="preview-toolbar">
                <button
                    className="secondary-button"
                    onClick={handleBackToEdit}
                >
                    Back to Edit
                </button>

                <button
                    className="secondary-button"
                    onClick={handleDownloadPDF}
                >
                    Download PDF
                </button>

                <button
                    className="primary-button"
                    onClick={handleSaveDocument}
                >
                    Save Document
                </button>
            </div>

            {/* A4 DOCUMENT */}
            <div className="rajsioni-document">

                {/* ================= HEADER ================= */}
                <div className="rajsioni-header">

                    {/* COLLEGE LOGO - TOP RIGHT */}
                    <img
                        src="/raisoni/college-logo.png"
                        alt="G H Raisoni College"
                        className="college-logo"
                    />

                    <div className="department-header">

                        <div className="orange-line"></div>

                        <h2>
                            Department of{" "}
                            {facultyDepartment === "IT"
                                ? " Information Technology"
                                : ` ${facultyDepartment
                                    .toLowerCase()
                                    .replace(/\b\w/g, (char) => char.toUpperCase())}`}
                        </h2>

                        <div className="orange-line"></div>

                    </div>

                </div>

                {/* ================= BODY ================= */}
                <div className="rajsioni-body">

                    <div className="document-meta">
                        <div>
                            Ref. No.: {referenceNumber}
                            <span style={{ marginLeft: "30px" }}>
                                Date: {finalIssueDate}
                            </span>
                        </div>

                        <span>
                            Session {finalSession} — Term: {finalTerm}
              
                        </span>
                    </div>

                   <div className="student-forum-notice">
                        {documentType || "NOTICE"}
                    </div>
                    
                    {documentType?.toLowerCase() === "application" && (
                        <div className="application-format">
                            <p>
                                <strong>To,</strong>
                                <br />
                                The Campus Director,
                                <br />
                                GHRCEM, Nagpur.
                            </p>
                    
                            <p>
                                <strong>Subject: {title}</strong>
                            </p>
                    
                            <p>
                                <strong>Respected Sir,</strong>
                            </p>
                        </div>
                        )}
                    
                    <div className="document-body-content">
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                            {updatedContent}
                        </ReactMarkdown>
                    </div>
                    
                    {documentType?.toLowerCase() === "application" && (
                        <p className="application-thanks">
                            Thanking you.
                        </p>
                    )}
                                        
                    {imageData && (
                        <div className="uploaded-document-image">
                    <Rnd
                        size={{
                            width: imageWidth,
                            height: imageHeight,
                        }}
                        style={{
                            position: "relative",
                            margin: "0 auto",
                        }}
                        lockAspectRatio
                        minWidth={120}
                        minHeight={80}
                        onResize={(e, direction, ref) => {
                            setImageWidth(ref.offsetWidth);
                            setImageHeight(ref.offsetHeight);
                        }}
                        enableResizing={{
                            top: false,
                            right: false,
                            bottom: false,
                            left: false,
                            topRight: false,
                            bottomRight: true,
                            bottomLeft: false,
                            topLeft: false,
                        }}
                    >
                        <img
                            src={imageData}
                            alt="Uploaded document reference"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                display: "block",
                            }}
                        />
                    </Rnd>
                        </div>
                    )}
                </div>
                {["report", "application","circular"].includes(
                        documentType?.toLowerCase()
                    ) && (
                    <div className="document-signatures">
                        <div className="signature-block">
                            <strong>Mr. Ashish Kakne</strong>
                            <span>
                                {documentType?.toLowerCase() === "application"
                                    ? "T&P Co-ordinator"
                                    : "Faculty In-charge"}
                            </span>
                        </div>
                
                        <div className="signature-block">
                            <strong>Dr. Sonali Ridhorkar</strong>
                            <span>HOD</span>
                        </div>
                    </div>
                )}

                      {/* ================= FOOTER ================= */}
                      <div className="rajsioni-footer">
                      
                          <div className="footer-text">
                              <strong>
                                  G H Raisoni College of Engineering & Management
                              </strong>
                      
                              <p>
                                  (Formerly Known as G H Raisoni Institute of Engineering &
                                  Technology, Nagpur)
                              </p>
                      
                              <p>
                                  An Autonomous Institute Affiliated to Rashtrasant Tukadoji
                                  Maharaj Nagpur University, Nagpur
                              </p>
                      
                              <p>
                                  Accredited by NAAC with “A+” Grade
                              </p>
                      
                              <p>
                                  Shraddha Park, B-37-39/1, MIDC, Hingna-Wadi Link Road,
                                  Nagpur-440016 (INDIA)
                              </p>
                          </div>
                      
                          <div className="footer-bottom">
                      
                              <img
                                  src="/raisoni/raisoni-education.png"
                                  alt="Raisoni Education"
                                  className="raisoni-education-logo"
                              />
                      
                              <div className="footer-line"></div>
                      
                          </div>
                      
                          <div className="footer-cities">
                              Nagpur | Pune | Jalgaon | Amravati | Pandhurna | Bhandara
                          </div>
                      
                      </div>

                </div>

            </div>
    );
};

export default StudentForumAIPreview;