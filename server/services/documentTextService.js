const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

const extractDocumentText = async (file) => {
    const extension = file.originalname
        .split(".")
        .pop()
        .toLowerCase();

    if (extension === "pdf") {
        const buffer = fs.readFileSync(file.path);
        const data = await pdfParse(buffer);

        return data.text;
    }

    if (extension === "docx") {
        const result = await mammoth.extractRawText({
            path: file.path,
        });

        return result.value;
    }

    if (extension === "txt") {
        return fs.readFileSync(file.path, "utf8");
    }

    throw new Error(
        "AI editing currently supports PDF, DOCX and TXT files."
    );
};

module.exports = {
    extractDocumentText,
};