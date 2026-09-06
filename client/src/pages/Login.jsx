import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        employeeId: "",
        password: "",
        captcha: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [captcha, setCaptcha] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");

const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
};

const generateCaptcha = async () => {
    try {
        const response = await api.get("/captcha");
        setCaptcha(response.data.captcha);
        setCaptchaInput("");
    } catch (error) {
        console.error("CAPTCHA generation failed:", error);
    }
};

useEffect(() => {
    generateCaptcha();
}, []);

const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/auth/login", formData);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.faculty)
            );

            alert("Login Successful");

            if (response.data.faculty.role === "admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/dashboard");
            }

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message || "Login failed"
            );
        }
};

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-header">
                    <h1>
                        DOCMitra <span>AI</span>
                    </h1>
                </div>

                <div className="login-title">
                    <h2>Sign In</h2>
                    <p>Access your department workspace</p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Registration ID</label>

                        <div className="input-with-icon">
                            <svg
                                viewBox="0 0 24 24"
                                className="input-icon"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                            </svg>
                        
                            <input
                                type="text"
                                name="employeeId"
                                placeholder="Enter your registration ID"
                                value={formData.employeeId}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <div className="password-wrapper input-with-icon">
                        
                            <svg
                                viewBox="0 0 24 24"
                                className="input-icon"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <rect x="4" y="10" width="16" height="11" rx="2" />
                                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                            </svg>
                        
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        
                        </div>
                    </div>

                    <div className="form-group">
    <label>CAPTCHA</label>

    <div className="captcha-box">
        <span>{captcha}</span>

        <button
            type="button"
            className="captcha-refresh"
            onClick={generateCaptcha}
        >
            ↻
        </button>
    </div>

    <div className="input-with-icon captcha-input">
        <svg
            viewBox="0 0 24 24"
            className="input-icon"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" />
            <path d="M9 12l2 2 4-4" />
        </svg>

        <input
            type="text"
            placeholder="Enter CAPTCHA"
            value={captchaInput}
            onChange={(e) => {
                setCaptchaInput(e.target.value);
                setFormData({
                    ...formData,
                    captcha: e.target.value,
                });
            }}
            required
        />
    </div>
</div>

                    <div className="login-options">
                        <button
                            type="button"
                            className="forgot-password"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Sign In
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Login;