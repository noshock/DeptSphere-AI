import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ChangePassword.css";

const ChangePassword = () => {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.put(
                "/faculty/change-password",
                {
                    currentPassword,
                    newPassword,
                    confirmPassword,
                }
            );

            setSuccess(response.data.message);

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                navigate("/profile");
            }, 1500);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to change password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-page">

            <div className="change-password-card">

                <div className="change-password-header">
                    <div className="change-password-icon">
                        🔐
                    </div>

                    <div>
                        <h1>Change Password</h1>
                        <p>
                            Update your account password securely
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="change-password-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="change-password-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="change-password-group">
                        <label>Current Password</label>

                        <div className="change-password-input">
                            <input
                                type={
                                    showCurrent
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter current password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                required
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowCurrent(!showCurrent)
                                }
                            >
                                {showCurrent ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div className="change-password-group">
                        <label>New Password</label>

                        <div className="change-password-input">
                            <input
                                type={
                                    showNew
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                required
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNew(!showNew)
                                }
                            >
                                {showNew ? "Hide" : "Show"}
                            </button>
                        </div>

                        <span className="password-hint">
                            Minimum 6 characters
                        </span>
                    </div>

                    <div className="change-password-group">
                        <label>Confirm New Password</label>

                        <div className="change-password-input">
                            <input
                                type={
                                    showConfirm
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
                                    setShowConfirm(!showConfirm)
                                }
                            >
                                {showConfirm ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="change-password-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Updating Password..."
                            : "Update Password"}
                    </button>

                </form>

                <button
                    type="button"
                    className="change-password-back"
                    onClick={() => navigate("/profile")}
                >
                    ← Back to Profile
                </button>

            </div>

        </div>
    );
};

export default ChangePassword;