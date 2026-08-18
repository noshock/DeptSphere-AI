import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        employeeId: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

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
                    <h1>DOCMitra AI</h1>
                </div>

                <div className="login-title">
                    <h2>Sign In</h2>
                    <p>Access your department workspace</p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Registration ID</label>

                        <input
                            type="text"
                            name="employeeId"
                            placeholder="Enter your registration ID"
                            value={formData.employeeId}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>

                        <div className="password-wrapper">

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