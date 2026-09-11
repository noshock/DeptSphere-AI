const Faculty = require("../models/Faculty");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const PasswordReset = require("../models/PasswordReset");

const emailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const registerFaculty = async (req, res) => {
    try {
        const {
            name,
            registrationId,
            email,
            password,
            department,
            designation,
            employeeId
        } = req.body;

        const existingFaculty = await Faculty.findOne({
             $or: [
                 { email },
                 { registrationId }
             ]
         });

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
          const { employeeId, password, captcha } = req.body;

            if (
                !req.session.captcha ||
                captcha?.toUpperCase() !== req.session.captcha
            ) {
                return res.status(400).json({
                    message: "Invalid CAPTCHA",
                });
            }

            req.session.captcha = null;
          
          const faculty = await Faculty.findOne({ employeeId });

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
const forgotPassword = async (req, res) => {
    try {
        const { employeeId } = req.body;

        if (!employeeId) {
            return res.status(400).json({
                message: "Registration ID is required",
            });
        }

        const faculty = await Faculty.findOne({ employeeId });

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty account not found",
            });
        }

        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 1000000).toString();

        // Hash the OTP before storing it
        const otpHash = await bcrypt.hash(otp, 10);

        // Remove any previous reset request
        await PasswordReset.deleteMany({
            employeeId: faculty.employeeId,
        });

        // OTP expires after 10 minutes
        await PasswordReset.create({
            employeeId: faculty.employeeId,
            email: faculty.email,
            otpHash,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });

        await emailTransporter.sendMail({
            from: `"DOCMitra AI" <${process.env.EMAIL_USER}>`,
            to: faculty.email,
            subject: "DOCMitra AI - Password Reset OTP",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h2 style="color: #6c51f2;">DOCMitra AI</h2>

                    <p>Hello ${faculty.name},</p>

                    <p>
                        We received a request to reset your DOCMitra AI password.
                    </p>

                    <p>Your OTP is:</p>

                    <div style="
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        margin: 20px 0;
                        color: #232327;
                    ">
                        ${otp}
                    </div>

                    <p>
                        This OTP will expire in <strong>10 minutes</strong>.
                    </p>

                    <p>
                        If you did not request a password reset, you can safely
                        ignore this email.
                    </p>

                    <p>Regards,<br>DOCMitra AI</p>
                </div>
            `,
        });

        res.status(200).json({
            message: "OTP sent successfully",
        });

    } catch (error) {
        console.error("Forgot password error:", error);

        res.status(500).json({
            message: "Unable to send OTP",
        });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const { employeeId, otp } = req.body;

        if (!employeeId || !otp) {
            return res.status(400).json({
                message: "Registration ID and OTP are required",
            });
        }

        const resetRequest = await PasswordReset.findOne({
            employeeId,
        });

        if (!resetRequest) {
            return res.status(400).json({
                message: "OTP not found or expired",
            });
        }

        // Check OTP expiration
        if (new Date() > resetRequest.expiresAt) {
            await PasswordReset.deleteOne({
                _id: resetRequest._id,
            });

            return res.status(400).json({
                message: "OTP has expired. Please request a new OTP",
            });
        }

        // Limit incorrect attempts
        if (resetRequest.attempts >= 5) {
            await PasswordReset.deleteOne({
                _id: resetRequest._id,
            });

            return res.status(400).json({
                message: "Too many incorrect attempts. Please request a new OTP",
            });
        }

        const isValidOtp = await bcrypt.compare(
            otp.toString(),
            resetRequest.otpHash
        );

        if (!isValidOtp) {
            resetRequest.attempts += 1;
            await resetRequest.save();

            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        // OTP verified
        req.session.passwordResetEmployeeId = employeeId;
        req.session.passwordResetVerified = true;

        await req.session.save();

        res.status(200).json({
            message: "OTP verified successfully",
        });

    } catch (error) {
        console.error("OTP verification error:", error);

        res.status(500).json({
            message: "Unable to verify OTP",
        });
    }
};
const resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            return res.status(400).json({
                message: "Password and confirm password are required",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }

        // Make sure OTP was successfully verified
        if (
            !req.session.passwordResetVerified ||
            !req.session.passwordResetEmployeeId
        ) {
            return res.status(401).json({
                message: "Please verify OTP first",
            });
        }

        const employeeId = req.session.passwordResetEmployeeId;

        const faculty = await Faculty.findOne({ employeeId });

        if (!faculty) {
            return res.status(404).json({
                message: "Faculty account not found",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        faculty.password = hashedPassword;
        await faculty.save();

        // Remove the OTP record
        await PasswordReset.deleteMany({
            employeeId,
        });

        // Clear password reset session
        req.session.passwordResetEmployeeId = null;
        req.session.passwordResetVerified = false;

        await req.session.save();

        res.status(200).json({
            message: "Password reset successfully",
        });

    } catch (error) {
        console.error("Reset password error:", error);

        res.status(500).json({
            message: "Unable to reset password",
        });
    }
};


module.exports = {
    registerFaculty,
    loginFaculty,
    forgotPassword,
    verifyOtp,
    resetPassword,
};