const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState >= 1) {
        return;
    }

    try {
        const mongoURI = process.env.MONGO_URI || "mongodb+srv://gourikpatil291_db_user:GNP-29100@cluster0.72vrvu9.mongodb.net/service_management?retryWrites=true&w=majority";
        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 15000
        });
        isConnected = true;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        throw error;
    }
};

module.exports = connectDB;
