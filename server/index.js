const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const repositoryRoutes = require("./routes/RepositoryRoutes");
const studentForumAIRoutes = require("./routes/studentForumAIRoutes");

const app = express();

app.use(cors());
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