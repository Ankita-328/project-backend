require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const app = express();
const authRoutes = require('./routes/authRoutes.js');
const sessionRoutes = require('./routes/sessionRoutes.js');
const questionRoutes = require('./routes/questionRoutes.js');
const { protect } = require("./middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");

// Middleware to handle CORS
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
let isConnected = false;

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        isConnected = true;
        console.log("MongoDB connected");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);
    }
};

app.use((req, res, next) => {
    if (!isConnected) {
        connectDB();
    }
    next();
})


// Middleware
app.use(express.json());
// Routes
app.use("/api/auth", authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/questions', questionRoutes);
app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect, generateConceptExplanation);
// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));
// Start Server
// const PORT = process.env.PORT || 5000
// app.listen(PORT, ()=>console.log(`Server running at Port ${PORT}`))

module.exports = app