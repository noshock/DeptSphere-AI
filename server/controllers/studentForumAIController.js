const {
    generateStudentForumDocument,
    editStudentForumDocument,
} = require("../services/geminiService");

const {
    extractDocumentText,
} = require("../services/documentTextService");

const Repository = require("../models/Repository");
const Notification = require("../models/Notification");
const Faculty = require("../models/Faculty");
const ReferenceCounter = require("../models/ReferenceCounter");


// ==========================================
// GENERATE STUDENT FORUM DOCUMENT
// ==========================================

const generateDocument = async (req, res) => {
    try {
        const { prompt, session, term } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                message: "Prompt is required",
            });
        }

        if (!session) {
            return res.status(400).json({
                message: "Session is required",
            });
        }

        if (!term) {
            return res.status(400).json({
                message: "Term is required",
            });
        }

        const generatedResult =
            await generateStudentForumDocument(
                prompt,
                session,
                term
            );
        
        res.status(200).json({
            success: true,
            content: generatedResult.content,
            title: generatedResult.title,
            category: generatedResult.category,
        });

    } catch (error) {
        console.error(
            "Student Forum AI Error:",
            error
        );

        res.status(503).json({
            success: false,
            message:
                "AI service is temporarily unavailable. Please try again.",
        });
    }
};


// ==========================================
// EDIT UPLOADED DOCUMENT WITH AI
// ==========================================

const editUploadedDocument = async (req, res) => {
    try {
        const {
            prompt,
            session,
            term,
            referenceNumber,
        } = req.body;

        // Document is required
        const documentFile = req.files?.file?.[0];

        // Image is optional
        const imageFile = req.files?.image?.[0] || null;

        if (!documentFile) {
            return res.status(400).json({
                message: "Document file is required",
            });
        }

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                message: "AI edit prompt is required",
            });
        }

        if (!session) {
            return res.status(400).json({
                message: "Session is required",
            });
        }

        if (!term) {
            return res.status(400).json({
                message: "Term is required",
            });
        }

        if (!referenceNumber) {
            return res.status(400).json({
                message: "Reference number is required",
            });
        }

        const normalizedTerm = term.trim().toLowerCase();

        if (!["even", "odd"].includes(normalizedTerm)) {
            return res.status(400).json({
                message: "Term must be Even or Odd",
            });
        }

        const finalTerm =
            normalizedTerm === "even" ? "Even" : "Odd";

        const documentText =
            await extractDocumentText(documentFile);

        if (!documentText || !documentText.trim()) {
            return res.status(400).json({
                message:
                    "Could not extract text from the document",
            });
        }

        const editedContent =
            await editStudentForumDocument(
                documentText,
                prompt,
                session,
                finalTerm,
                imageFile
            );

        res.status(200).json({
            success: true,
            content: editedContent,
        });

    } catch (error) {
        console.error(
            "Student Forum AI Upload Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ==========================================
// GET NEXT REFERENCE NUMBER
// ==========================================

const getNextReferenceNumber = async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.user.id).select(
            "department"
        );

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found",
            });
        }

        if (!faculty.department) {
            return res.status(400).json({
                message: "Faculty department is not set",
            });
        }

        const year = new Date().getFullYear();

const counter = await ReferenceCounter.findOne({
    faculty: req.user.id,
    year,
});

const nextSequence = counter ? counter.sequence + 1 : 1;

const normalizedDepartment = faculty.department
    .trim()
    .toLowerCase();

let departmentCode;

if (
    normalizedDepartment === "information technology" ||
    normalizedDepartment === "it"
) {
    departmentCode = "IT";
} else if (
    normalizedDepartment === "computer science" ||
    normalizedDepartment === "cs"
) {
    departmentCode = "CS";
} else {
    departmentCode = normalizedDepartment
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .toUpperCase();
}

        const referenceNumber =
    `${departmentCode}/SF/${year}/${String(nextSequence).padStart(3, "0")}`;

        res.status(200).json({
            success: true,
            referenceNumber,
        });

    } catch (error) {
        console.error(
            "Get Student Forum Reference Number Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to generate reference number",
        });
    }
};


// ==========================================
// SAVE DOCUMENT TO REPOSITORY
// ==========================================

const saveDocumentToRepository = async (req, res) => {
    try {
        const {
            title,
            category,
            subject,
            department,
            session,
            term,
            referenceNumber,
        } = req.body;

        const normalizedTerm = term?.trim().toLowerCase();

        if (!["even", "odd"].includes(normalizedTerm)) {
            return res.status(400).json({
                message: "Term must be Even or Odd",
            });
        }

        const faculty = await Faculty.findById(req.user.id).select(
            "department name"
        );
        
        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found",
            });
        }
        
        const facultyDepartment = faculty.department;
        
        if (!facultyDepartment) {
            return res.status(400).json({
                message: "Faculty department is not set",
            });
        }
        
        const finalTerm =
            normalizedTerm === "even" ? "Even" : "Odd";
        
        // PDF file is required
        if (!req.file) {
            return res.status(400).json({
                message: "PDF file is required",
            });
        }

        // Session is required
        if (!session) {
            return res.status(400).json({
                message: "Session is required",
            });
        }

        // Term is required
        if (!term) {
            return res.status(400).json({
                message: "Term is required",
            });
        }

        // Make sure only PDF is saved
        if (req.file.mimetype !== "application/pdf") {
            return res.status(400).json({
                message: "Only PDF files are allowed",
            });
        }

        const year = new Date().getFullYear();

        const counter = await ReferenceCounter.findOneAndUpdate(
            {
                faculty: req.user.id,
                year,
            },
            {
                $inc: { sequence: 1 },
            },
            {
                new: true,
                upsert: true,
            }
        );
        
        const normalizedDepartment =
            facultyDepartment.trim().toLowerCase();
        
        let departmentCode;
        
        if (
            normalizedDepartment === "information technology" ||
            normalizedDepartment === "it"
        ) {
            departmentCode = "IT";
        } else if (
            normalizedDepartment === "computer science" ||
            normalizedDepartment === "cs"
        ) {
            departmentCode = "CS";
        } else {
            departmentCode = normalizedDepartment
                .split(/\s+/)
                .map((word) => word[0])
                .join("")
                .toUpperCase();
        }
        
        const finalReferenceNumber =
            `${departmentCode}/SF/${year}/${String(counter.sequence).padStart(3, "0")}`;

        // Create Repository record
        const repository = await Repository.create({
            title: title,

            subject:
                subject ||
                "Student Forum",

            department: facultyDepartment,

            session,

            term: finalTerm,

            category: category,

            fileName: req.file.filename,

            fileUrl: `uploads/${req.file.filename}`,

            fileType: "application/pdf",

            uploadedBy: req.user.id,

            referenceNumber: finalReferenceNumber,
        });
        if (req.user.role === "faculty") {
            const faculty = await Faculty.findById(req.user.id).select("name");
        
            await Notification.create({
                title: "New Document Uploaded",
                message: `${faculty?.name || "Faculty"} uploaded "${repository.title}" — Session ${repository.session}, Term ${repository.term}`,
                type: "Document Upload",
                documentId: repository._id,
                recipientRole: "admin",
            });
        }

        res.status(201).json({
            success: true,
            message: "PDF saved to Repository successfully",
            repository,
        });

    } catch (error) {
        console.error(
            "Save Student Forum Repository Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to save PDF to Repository",
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    generateDocument,
    editUploadedDocument,
    saveDocumentToRepository,
    getNextReferenceNumber,
};