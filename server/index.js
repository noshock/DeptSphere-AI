const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");

const app = express();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const repositoryRoutes = require("./routes/RepositoryRoutes");
const studentForumAIRoutes = require("./routes/studentForumAIRoutes");
const captchaRoutes = require("./routes/captchaRoutes");


app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());

// Serve uploaded files
app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"), {
        setHeaders: (res, filePath) => {
            if (path.extname(filePath).toLowerCase() === ".pdf") {
                res.setHeader("Content-Type", "application/pdf");
                res.setHeader(
                    "Content-Disposition",
                    "inline"
                );
            }
        },
    })
);

app.use(
    session({
        secret: process.env.JWT_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 5 * 60 * 1000, // 5 minutes
        },
    })
);

app.use("/api/captcha", captchaRoutes);

const PORT = 5000;

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/repository", repositoryRoutes);
app.use(
    "/api/student-forum-ai",
    studentForumAIRoutes
);

app.get("/", (req, res) => {
    res.send("Welcome to DeptSphere AI Backend");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});