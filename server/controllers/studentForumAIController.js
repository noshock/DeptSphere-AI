const {
    generateStudentForumDocument,
} = require("../services/geminiService");

const generateDocument = async (req, res) => {
    try {
        const { prompt, semester } = req.body;

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                message: "Prompt is required",
            });
        }

        if (!semester) {
            return res.status(400).json({
                message: "Semester is required",
            });
        }

        const generatedContent =
            await generateStudentForumDocument(
                prompt,
                semester
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

        res.status(500).json({
            success: false,
            message: "Failed to generate document",
        });
    }
};

module.exports = {
    generateDocument,
};