const mongoose = require('mongoose');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch(e) {}

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb+srv://gourikpatil291_db_user:GNP-29100@cluster0.72vrvu9.mongodb.net/service_management?retryWrites=true&w=majority";
        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 15000
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
