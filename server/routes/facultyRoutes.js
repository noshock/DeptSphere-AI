const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const Faculty = require("../models/Faculty");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const profilePhotoDir = path.join(__dirname, "../uploads/profile");

if (!fs.existsSync(profilePhotoDir)) {
    fs.mkdirSync(profilePhotoDir, { recursive: true });
}

const profilePhotoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profilePhotoDir);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);
        cb(null, `profile-${req.user.id}${extension}`);
    },
});

const uploadProfilePhoto = multer({
    storage: profilePhotoStorage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
        }
    },
});
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.user.id).select("-password");

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found",
            });
        }

        res.status(200).json(faculty);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});
router.put(
    "/profile/photo",
    authMiddleware,
    uploadProfilePhoto.single("profilePhoto"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    message: "Please select a profile photo.",
                });
            }

            const faculty = await Faculty.findById(req.user.id);

            if (!faculty) {
                return res.status(404).json({
                    message: "Faculty not found.",
                });
            }

            faculty.profilePhoto = `/uploads/profile/${req.file.filename}`;

            await faculty.save();

            res.status(200).json({
                message: "Profile photo updated successfully.",
                profilePhoto: faculty.profilePhoto,
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
);
router.get("/all", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const faculty = await Faculty.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json(faculty);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});
router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { isActive } = req.body;

        const faculty = await Faculty.findById(req.params.id);

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found",
            });
        }

        faculty.isActive = isActive;
        await faculty.save();

        res.status(200).json({
            message: "Faculty status updated successfully",
            faculty,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({
                message: "You cannot delete your own admin account.",
            });
        }

        const faculty = await Faculty.findById(req.params.id);

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found",
            });
        }

        await faculty.deleteOne();

        res.status(200).json({
            message: "Faculty deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

router.post("/create", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const {
            name,
            employeeId,
            email,
            password,
            department,
            designation,
            role,
        } = req.body;

        const existingFaculty = await Faculty.findOne({
            $or: [
                { employeeId },
                { email },
            ],
        });

        if (existingFaculty) {
            return res.status(400).json({
                message: "Faculty with this Registration ID or email already exists.",
            });
        }

        const bcrypt = require("bcryptjs");

        const hashedPassword = await bcrypt.hash(password, 10);

        const faculty = await Faculty.create({
            name,
            employeeId,
            email,
            password: hashedPassword,
            department,
            designation,
            role: role || "faculty",
        });

        const facultyResponse = faculty.toObject();
        delete facultyResponse.password;

        res.status(201).json({
            message: "Faculty created successfully",
            faculty: facultyResponse,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

router.put("/change-password", authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "All fields are required.",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "New passwords do not match.",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters.",
            });
        }

        const faculty = await Faculty.findById(req.user.id);

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found.",
            });
        }

        const isMatch = await bcrypt.compare(
            currentPassword,
            faculty.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect.",
            });
        }

        const samePassword = await bcrypt.compare(
            newPassword,
            faculty.password
        );

        if (samePassword) {
            return res.status(400).json({
                message: "New password cannot be the same as the current password.",
            });
        }

        faculty.password = await bcrypt.hash(newPassword, 10);
        await faculty.save();

        res.status(200).json({
            message: "Password changed successfully.",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router;