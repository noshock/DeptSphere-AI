import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ForgotPassword.css";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [employeeId, setEmployeeId] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSendOtp = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await api.post("/auth/forgot-password", {
                employeeId,
            });

            setMessage(response.data.message);
            setStep(2);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to send OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await api.post("/auth/verify-otp", {
                employeeId,
                otp,
            });

            setMessage(response.data.message);
            setStep(3);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Invalid OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                "/auth/reset-password",
                {
                    password,
                    confirmPassword,
                }
            );

            setMessage(response.data.message);

            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to reset password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-page">

            <div className="forgot-password-card">

                <div className="forgot-password-header">
                    <h1>
                        DOCMitra <span>AI</span>
                    </h1>
                </div>

                <div className="forgot-password-title">

                    {step === 1 && (
                        <>
                            <h2>Forgot Password?</h2>
                            <p>
                                Enter your registration ID to reset your password
                            </p>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2>Verify OTP</h2>
                            <p>
                                Enter the OTP sent to your registered email
                            </p>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h2>Create New Password</h2>
                            <p>
                                Enter a new password for your account
                            </p>
                        </>
                    )}

                </div>

                {message && (
                    <div className="forgot-success">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="forgot-error">
                        {error}
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleSendOtp}>

                        <div className="forgot-form-group">
                            <label>Registration ID</label>

                            <input
                                type="text"
                                placeholder="Enter your registration ID"
                                value={employeeId}
                                onChange={(e) =>
                                    setEmployeeId(e.target.value)
                                }
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="forgot-button"
                            disabled={loading}
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>

                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>

                        <div className="forgot-form-group">
                            <label>OTP</label>

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength="6"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value.replace(/\D/g, "")
                                    )
                                }
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="forgot-button"
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword}>

                        <div className="forgot-form-group">
                            <label>New Password</label>

                            <div className="forgot-password-input">
                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        <div className="forgot-form-group">
                            <label>Confirm Password</label>

                            <div className="forgot-password-input">
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                >
                                    {showConfirmPassword
                                        ? "Hide"
                                        : "Show"}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="forgot-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Updating Password..."
                                : "Reset Password"}
                        </button>

                    </form>
                )}

                <button
                    type="button"
                    className="back-to-login"
                    onClick={() => navigate("/")}
                >
                    ← Back to Login
                </button>

            </div>

        </div>
    );
};

export default ForgotPassword;