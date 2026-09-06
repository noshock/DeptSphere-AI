const {
    generateStudentForumDocument,
    editStudentForumDocument,
} = require("../services/geminiService");

const {
    extractDocumentText,
} = require("../services/documentTextService");

const Repository = require("../models/Repository");


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

        const generatedContent =
            await generateStudentForumDocument(
                prompt,
                session,
                term
            );

        res.status(200).json({
            success: true,
            content: generatedContent,
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
// SAVE DOCUMENT TO REPOSITORY
// ==========================================

const saveDocumentToRepository = async (req, res) => {
    try {
        const {
            title,
            description,
            subject,
            department,
            session,
            term,
        } = req.body;

        const normalizedTerm = term?.trim().toLowerCase();

        if (!["even", "odd"].includes(normalizedTerm)) {
            return res.status(400).json({
                message: "Term must be Even or Odd",
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

        // Create Repository record
        const repository = await Repository.create({
            title:
                title ||
                `Student Forum - ${session} - ${term}`,

            description:
                description ||
                "AI generated Student Forum document",

            subject:
                subject ||
                "Student Forum",

            department:
                department ||
                "Information Technology",

            session,

            term: finalTerm,

            category: "Other",

            fileName: req.file.filename,

            fileUrl: `uploads/${req.file.filename}`,

            fileType: "application/pdf",

            uploadedBy: req.user.id,
        });

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
};