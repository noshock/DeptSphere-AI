import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Profile = () => {
    const [faculty, setFaculty] = useState(null);
    const [activeTab, setActiveTab] = useState("basic");
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/faculty/profile");
                setFaculty(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, []);

    const handlePhotoChange = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Please select a JPG, JPEG, PNG or WEBP image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Profile photo must be less than 5 MB.");
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();
            formData.append("profilePhoto", file);

            const response = await api.put(
                "/faculty/profile/photo",
                formData
            );

            setFaculty((previous) => ({
                ...previous,
                profilePhoto: response.data.profilePhoto,
            }));

            alert("Profile photo updated successfully.");
        } catch (error) {
            console.error("Profile photo upload error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to upload profile photo."
            );
        } finally {
            setUploading(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    if (!faculty) {
        return (
            <div className="profile-page">
                <h1>My Profile</h1>
                <p>Loading profile...</p>
            </div>
        );
    }

    const profilePhotoUrl = faculty.profilePhoto
        ? `http://localhost:5000${faculty.profilePhoto}`
        : null;

    return (
        <div className="profile-page">
            <h1>My Profile</h1>

            <div className="profile-header-card">
                <div className="profile-photo-wrapper">
                    <div className="profile-page-avatar">
                        {profilePhotoUrl ? (
                            <img
                                src={profilePhotoUrl}
                                alt="Profile"
                            />
                        ) : (
                            <span>👤</span>
                        )}
                    </div>

                    <button
                        type="button"
                        className="change-photo-button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? "Uploading..." : "Change Photo"}
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handlePhotoChange}
                        hidden
                    />
                </div>

                <div className="profile-header-info">
                    <h2>{faculty.name?.toUpperCase()}</h2>

                    <p>
                        {faculty.role === "admin"
                            ? "Administrator"
                            : faculty.designation || "Faculty"}
                    </p>
                </div>
            </div>

            <div className="profile-tabs">
                <button
                    type="button"
                    className={
                        activeTab === "basic"
                            ? "profile-tab active"
                            : "profile-tab"
                    }
                    onClick={() => setActiveTab("basic")}
                >
                    Basic Information
                </button>

                <button
                    type="button"
                    className={
                        activeTab === "login"
                            ? "profile-tab active"
                            : "profile-tab"
                    }
                    onClick={() => setActiveTab("login")}
                >
                    Login Information
                </button>
            </div>

            <div className="profile-content">
                {activeTab === "basic" && (
                    <fieldset className="profile-info-card">
                        <legend>Basic Information</legend>

                        <div className="profile-info-row">
                            <span>Full Name :</span>
                            <strong>{faculty.name || "--"}</strong>
                        </div>

                        <div className="profile-info-row">
                            <span>Date of Birth :</span>
                            <strong>
                                {faculty.dateOfBirth || "--"}
                            </strong>
                        </div>

                        <div className="profile-info-row">
                            <span>Gender :</span>
                            <strong>{faculty.gender || "--"}</strong>
                        </div>

                        <div className="profile-info-row">
                            <span>Mobile :</span>
                            <strong>
                                {faculty.mobile ||
                                    faculty.phone ||
                                    "--"}
                            </strong>
                        </div>

                        <div className="profile-info-row">
                            <span>Personal Email :</span>
                            <strong>
                                {faculty.personalEmail ||
                                    faculty.email ||
                                    "--"}
                            </strong>
                        </div>

                        <div className="profile-info-row">
                            <span>Institute Email :</span>
                            <strong>
                                {faculty.instituteEmail || "--"}
                            </strong>
                        </div>
                    </fieldset>
                )}

                {activeTab === "login" && (
                    <>
                        <div className="profile-security-action">
                            <Link
                                to="/change-password"
                                className="profile-change-password"
                            >
                                Change Password
                            </Link>
                        </div>

                        <fieldset className="profile-info-card">
                            <legend>Login Information</legend>

                            <div className="profile-info-row">
                                <span>User Name :</span>
                                <strong>
                                    {faculty.employeeId || "--"}
                                </strong>
                            </div>

                            <div className="profile-info-row">
                                <span>Role :</span>
                                <strong>
                                    {faculty.role || "--"}
                                </strong>
                            </div>

                            <div className="profile-info-row">
                                <span>Account Status :</span>
                                <strong>
                                    {faculty.isActive
                                        ? "ACTIVE"
                                        : "INACTIVE"}
                                </strong>
                            </div>

                            <div className="profile-info-row">
                                <span>OTP Mandatory :</span>
                                <strong>
                                    {faculty.otpMandatory
                                        ? "Yes"
                                        : "No"}
                                </strong>
                            </div>
                        </fieldset>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;