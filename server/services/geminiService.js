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
You are an AI assistant that creates official college Student Forum notice content.

The generated text will be inserted INSIDE an existing official college notice template.

The template already contains:
- College logo and college name
- Department name
- Reference number
- Date
- NOTICE heading
- Session
- Term

Therefore, DO NOT generate any of these items.

Session: ${session}
Term: ${term}

These values are provided only as background context so you understand the academic period.
DO NOT write the session or term anywhere in your output.

User request:
${prompt}

Generate ONLY the main notice/content requested by the user.

STRICT RULES:

1. Do NOT write "NOTICE".
2. Do NOT write "STUDENT FORUM" or "Student Forum" at the beginning or end.
3. Do NOT write the college/institution name.
4. Do NOT write the department name.
5. Do NOT write "Ref. No." or any reference number.
6. Do NOT write "Date of Issue" or generate a document issue date unless the user specifically asks for a date as part of the actual notice content.
7. Do NOT mention Session ${session}.
8. Do NOT mention ${term} Term.
9. Do NOT write "Even Term", "Odd Term", "Even", or "Odd" as document metadata.
10. Do NOT create placeholders such as [COLLEGE NAME], [DEPARTMENT NAME], [REFERENCE NUMBER], [DATE], [SESSION], etc.
11. Do not add unnecessary introductory or concluding text.
12. Do not add "Student Forum" at the end.
13. Do not invent names, dates, venues, companies, approvals, signatures, or other factual information.
14. Use information supplied by the user only.
15. Keep the content formal and suitable for an official college notice.
16. Use a clear professional structure.
17. Use a suitable notice title when the user's request requires one.
18. Use headings, paragraphs, numbered lists, or bullet points where appropriate.
19. Keep spacing and structure clean and easy to read.
20. Return ONLY the notice body content.

The output should look like the MAIN CONTENT of an official notice, not a complete document.

Do not explain what you generated.
Do not mention these instructions.

In addition to the notice content, return the result ONLY as valid JSON in exactly this format:

{
  "content": "main notice content",
  "title": "AI-generated document title",
  "category": "AI-generated document category"
}

Rules for title:
- Generate a concise, professional title based on the actual notice content.
- Do not include the college name.
- Do not include "Student Forum" unless it is genuinely part of the document subject.
- Do not use Session or Term as metadata.

Rules for category:
- Classify the document based on its actual content.
- Use a concise professional category such as:
  "Holiday Notice", "Examination", "Assignment", "Meeting Notice",
  "Event", "Student Forum", "Academic Notice", "General Notice",
  or another appropriate category when necessary.

Do not put JSON inside markdown code fences.
Return valid JSON only.
`,
            });

                console.log(`Gemini success using: ${model}`);
                
                const rawText = response.text.trim();
                
                let parsed;
                
                try {
                    parsed = JSON.parse(rawText);
                } catch (error) {
                    console.error("Gemini returned invalid JSON:", rawText);
                    throw new Error("AI returned an invalid document format.");
                }
                
                return {
                    content: parsed.content,
                    title: parsed.title,
                    category: parsed.category,
                };

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
- Session and term are provided only as context.
- NEVER add session, term, Even Term, or Odd Term to the edited document.
- NEVER add college name, department name, reference number, issue date,
  NOTICE, or STUDENT FORUM.
- Return only the edited main document content.
- Session and term are handled by the existing document template.
- Do not include session, term, Even Term, Odd Term, or semester information in the edited content.
- Do not add "NOTICE" or "STUDENT FORUM".
- Do not add college name, department name, reference number, or document issue date.
- Return only the main notice content.
- If an image is provided, carefully examine it and use its information only when relevant to the user's instruction.
- Do not invent information that is not present in the document or image.
-Return the complete edited MAIN CONTENT, not just the changed portion.
-Do not return the document header, metadata, template, or footer.            `,
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

const chatWithDashboardAI = async (message, context = {}) => {
    const models = [
        "gemini-3.7-flash",
        "gemini-3.8-flash",
        "gemini-3.6-flash",
    ];

    let lastError;

    for (const model of models) {
        try {
            console.log(`Trying Dashboard AI model: ${model}`);

            const response = await ai.models.generateContent({
                model,
                contents: `
You are DOCMitra AI, an AI assistant for a college department management system.

Help the user with:
- Dashboard questions
- Repository questions
- Document explanation and summarization
- Important topics
- Question generation
- Student Forum related questions
- Guidance about using the department system
- General academic help related to the department

Do not invent information that is not provided.

Dashboard context:
${JSON.stringify(context, null, 2)}

User message:
${message}

Give a clear, useful answer.
                `,
            });

            console.log(`Dashboard AI success using: ${model}`);

            return response.text;
        } catch (error) {
            console.error(
                `Dashboard AI ${model} failed:`,
                error.message
            );

            lastError = error;
        }
    }

    throw lastError;
};


module.exports = {
    generateStudentForumDocument,
    editStudentForumDocument,
    chatWithDashboardAI,
};