import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import api from "../services/api";

const StudentForumAIPreview = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { content, session, term } = location.state || {};

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
          session: finalSession,
          term: finalTerm,
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
    try {
        if (!finalSession) {
            alert("Session is required");
            return;
        }

        if (!finalTerm) {
            alert("Term is required");
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

        formData.append(
            "title",
            `Student Forum - ${finalSession} - ${finalTerm}`
        );

        formData.append(
            "description",
            "AI generated Student Forum document"
        );

        formData.append(
            "subject",
            "Student Forum"
        );

        formData.append(
            "department",
            "Information Technology"
        );

        formData.append(
            "session",
            finalSession
        );

        formData.append(
            "term",
            finalTerm
        );

        console.log("Saving PDF:", {
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
                            Department of Information Technology
                        </h2>

                        <div className="orange-line"></div>

                    </div>

                </div>

                {/* ================= BODY ================= */}
                <div className="rajsioni-body">

                 <div className="document-meta">
                     <span>
                         Session {finalSession} — Term: {finalTerm}
                     </span>
                 </div>

                    <ReactMarkdown>
                        {content}
                    </ReactMarkdown>

                </div>

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