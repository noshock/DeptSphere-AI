const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateStudentForumDocument = async (
    prompt,
    session,
    term
) => {
    const models = [
        "gemini-3.8-flash",
        "gemini-3.7-flash",
        "gemini-3.6-flash",
    ];

    let lastError;

    for (const model of models) {
        try {
            console.log(`Trying Gemini model: ${model}`);

            const response = await ai.models.generateContent({
                model,
                contents: `
You are an AI assistant specifically for the Student Forum (D.50)
of a college.

Session: ${session}
Term: ${term}

The user wants to create a Student Forum document.

User request:
${prompt}

Generate professional, formal college-document content.

Do not invent specific names, dates, signatures, or approvals unless
the user provides them.
`,
            });

            console.log(`Gemini success using: ${model}`);

            return response.text;

        } catch (error) {
            console.error(
                `Gemini ${model} failed:`,
                error.message
            );

            lastError = error;
        }
    }

    throw lastError;
};


const editStudentForumDocument = async (
    documentText,
    prompt,
    session,
    term
) => {
    const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `
You are an AI assistant for the Student Forum (D.50) of a college.

Session: ${session}
Term: ${term}

The user has uploaded an existing Student Forum document.

Existing document:
${documentText}

The user wants to modify this document according to these instructions:

${prompt}

Edit the existing document according to the user's instructions.

Important rules:

- Preserve the original document's meaning and important information.
- Do not invent names, dates, signatures, approvals, or other facts.
- Only change what the user requested.
- Keep the document formal and suitable for an official college document.
- Use the provided session and term when relevant.
- Do not mention semesters.
- Return the complete edited document, not just the changed portion.
        `,
    });

    return response.text;
};


module.exports = {
    generateStudentForumDocument,
    editStudentForumDocument,
};