const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
    uploadFile,
    getAllFiles,
    deleteFile,
} = require("../controllers/RepositoryController");

router.post(
    "/upload",
    authMiddleware,
    upload.single("file"),
    uploadFile
);

router.get("/", authMiddleware, getAllFiles);
router.delete("/:id", authMiddleware, deleteFile);
module.exports = router;