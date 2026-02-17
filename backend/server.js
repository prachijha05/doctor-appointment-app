import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force load .env
dotenv.config({ path: path.join(__dirname, ".env") });
console.log("Loaded KEY:", process.env.OPENAI_API_KEY);

// Debug
console.log("OPENAI KEY:", process.env.OPENAI_API_KEY);
// MUST be FIRST

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
// import aiRoutes from "./routes/aiRoutes.js";

// Load environment variables

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Your React app URL
    credentials: true, // Allow cookies
  }),
);

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/ai", aiRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Doctor Appointment API is running..." });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
