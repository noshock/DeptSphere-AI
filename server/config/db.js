const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers([
    "1.1.1.1",
    "8.8.8.8",
]);

require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;