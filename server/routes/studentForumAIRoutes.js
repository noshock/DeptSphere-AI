const express = require("express");
const router = express.Router();

const {
    generateDocument,
    editUploadedDocument,
    saveDocumentToRepository,
} = require("../controllers/studentForumAIController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
    "/generate",
    authMiddleware,
    generateDocument
);

router.post(
    "/edit-upload",
    authMiddleware,
    upload.fields([
        { name: "file", maxCount: 1 },
        { name: "image", maxCount: 1 },
    ]),
    editUploadedDocument
);

router.post(
    "/save",
    authMiddleware,
    upload.single("file"),
    saveDocumentToRepository
);
module.exports = router;