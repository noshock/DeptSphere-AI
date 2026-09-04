const Repository = require("../models/Repository");

const uploadFile = async (req, res) => {
    try {
        const {
            title,
            description,
            subject,
            department,
            session,
            term,
            category,
        } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }

        const repository = await Repository.create({
            title,
            description,
            subject,
            department,
            session,
            term,
            category,
            fileName: req.file.filename,
            fileUrl: req.file.path,
            fileType: req.file.mimetype,
            uploadedBy: req.user.id,
        });

        res.status(201).json({
            message: "File uploaded successfully",
            repository,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getAllFiles = async (req, res) => {
    try {
        const files = await Repository.find()
            .populate("uploadedBy", "name email department")
            .sort({ createdAt: -1 });

        res.status(200).json(files);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteFile = async (req, res) => {
    try {
        const repository = await Repository.findById(req.params.id);

        if (!repository) {
            return res.status(404).json({
                message: "File not found",
            });
        }

        const fs = require("fs");

        if (fs.existsSync(repository.fileUrl)) {
            fs.unlinkSync(repository.fileUrl);
        }

        await repository.deleteOne();

        res.status(200).json({
            message: "File deleted successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

        const updateFile = async (req, res) => {
            try {
               const {
            title,
            description,
            subject,
            department,
            session,
            term,
            category,
        } = req.body;

        const repository = await Repository.findById(req.params.id);

        if (!repository) {
            return res.status(404).json({
                message: "File not found",
            });
        }

        repository.title = title || repository.title;
        repository.description = description || repository.description;
        repository.subject = subject || repository.subject;
        repository.department = department || repository.department;
        repository.session = session || repository.session;
        repository.term = term || repository.term;
        repository.category = category || repository.category;

        await repository.save();

        res.status(200).json({
            message: "Repository updated successfully",
            repository,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const searchFiles = async (req, res) => {
    try {
        const { title } = req.query;

        const files = await Repository.find({
            title: {
                $regex: title,
                $options: "i",
            },
        }).populate("uploadedBy", "name email");

        res.status(200).json(files);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const filterBySession = async (req, res) => {
    try {
        const { session, term } = req.query;

        const filter = {};

        if (session) {
            filter.session = session;
        }

        if (term) {
            filter.term = term;
        }

        const files = await Repository.find(filter)
            .populate("uploadedBy", "name email");

        res.status(200).json(files);

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    uploadFile,
    getAllFiles,
    deleteFile,
    updateFile,
    searchFiles,
    filterBySession,
};