const { MongoClient } = require("mongodb");
const dns = require("dns")

dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);

async function testConnection() {
    try {
        await client.connect();
        console.log("MongoDB Connected");
        await client.close();
    } catch (error) {
        console.error(error);
   }
}
testConnection();