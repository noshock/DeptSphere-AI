const Faculty = require("../models/Faculty");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerFaculty = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            department,
            designation,
            employeeId
        } = req.body;

        const existingFaculty = await Faculty.findOne({ email });

        if (existingFaculty) {
            return res.status(400).json({
                message: "Faculty already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const faculty = await Faculty.create({
            name,
            email,
            password: hashedPassword,
            department,
            designation,
            employeeId,
        });

        res.status(201).json({
            message: "Faculty registered successfully",
            faculty,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const loginFaculty = async (req, res) => {
    try {
        const { email, password } = req.body;

        const faculty = await Faculty.findOne({ email });

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty not found",
            });
        }

        const isMatch = await bcrypt.compare(password, faculty.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password",
            });
        }

        const token = jwt.sign(
       {
         id: faculty._id,
         role: faculty.role,
         },
          process.env.JWT_SECRET,
         {
          expiresIn: "7d",
        }
        );

     const facultyResponse = faculty.toObject();
     delete facultyResponse.password;

     res.status(200).json({
     message: "Login successful",
     token,
     faculty: facultyResponse,
    });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    registerFaculty,
    loginFaculty,
};