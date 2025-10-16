const mongoose = require("mongoose");
let isConnected = false;
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        isConnected = true;
        console.log("MongoDB connected");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    }
};

module.exports = connectDB;