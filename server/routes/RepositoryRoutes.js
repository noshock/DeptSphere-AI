const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
    uploadFile,
    getAllFiles,
    deleteFile,
    updateFile,
    searchFiles,
    filterBySemester,
} = require("../controllers/RepositoryController");

router.post(
    "/upload",
    authMiddleware,
    upload.single("file"),
    uploadFile
);

router.get("/search", authMiddleware, searchFiles);
router.get("/filter/semester", authMiddleware, filterBySemester);
router.get("/", authMiddleware, getAllFiles);
router.delete("/:id", authMiddleware, deleteFile);
router.put("/:id", authMiddleware, updateFile);
module.exports = router;