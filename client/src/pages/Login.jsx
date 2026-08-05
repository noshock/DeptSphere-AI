import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

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

            alert("Login Successful");

            navigate("/dashboard");

        } catch (error) {
            console.log(error);
            console.log(error.response);

            alert(
                error.response?.data?.message || error.message

            );
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h2>Faculty Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;