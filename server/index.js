const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const facultyRoutes = require("./routes/facultyRoutes");

const app = express();

app.use(express.json());

const PORT = 5000;

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);


app.get("/", (req, res) => {
  res.send("Welcome to DeptSphere AI Backend");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});