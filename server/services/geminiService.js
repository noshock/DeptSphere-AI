const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateStudentForumDocument = async (prompt, semester) => {
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `
You are an AI assistant specifically for the Student Forum (D.50)
of a college.

Semester: ${semester}

The user wants to create a Student Forum document.

User request:
${prompt}

Generate professional, formal college-document content.
Do not invent specific names, dates, signatures, or approvals unless
the user provides them.
        `,
    });

    return response.text;
};

module.exports = {
    generateStudentForumDocument,
};