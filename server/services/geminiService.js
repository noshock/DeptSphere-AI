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
    term,
    imageFile = null
) => {
    const parts = [
        {
            text: `
You are an AI assistant for the Student Forum (D.50) of a college.

Session: ${session}
Term: ${term}

The user has uploaded an existing Student Forum document.

Existing document:
${documentText}

The user wants to modify this document according to these instructions:

${prompt}

Important rules:

- Preserve the original document's meaning and important information.
- Do not invent names, dates, signatures, approvals, or other facts.
- Only change what the user requested.
- Keep the document formal and suitable for an official college document.
- Use the provided session and term when relevant.
- Do not mention semesters.
- If an image is provided, carefully examine it and use its information only when relevant to the user's instruction.
- Do not invent information that is not present in the document or image.
- Return the complete edited document, not just the changed portion.
            `,
        },
    ];

    // Add image only when the user selected one
    if (imageFile) {
        const fs = require("fs");

        const imageData = fs.readFileSync(imageFile.path);

        parts.push({
            inlineData: {
                mimeType: imageFile.mimetype,
                data: imageData.toString("base64"),
            },
        });
    }

    const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: [
            {
                role: "user",
                parts,
            },
        ],
    });

    return response.text;
};


module.exports = {
    generateStudentForumDocument,
    editStudentForumDocument,
};