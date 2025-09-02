import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import dbConnect from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cookieParser from "cookie-parser";
import inventory from "./routes/inventoryRoute.js";
import serviceRoutes from "./routes/Service_Route.js";
import appoinment from "./routes/appoimentRouts.js";
import Package from "./routes/PackageRoute.js";
import userRoutes from "./routes/userRoute.js";
import cors from "cors";
import feedback from "./routes/feedbackRoute.js";
import { fileURLToPath } from "url"; // Import to convert URL to file path
import { dirname, join } from "path"; // Import to work with paths

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(express.json());

// Apply CORS before defining routes
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from your frontend
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Array format for methods
  allowedHeaders: "Content-Type,Authorization", 
  credentials: true,
};

app.use(cors(corsOptions));

// Calculate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url); // Get the current file's path
const __dirname = dirname(__filename); // Get the directory name from the file path

// Serve static files from the uploads folder
app.use("/uploads", express.static(join(__dirname, "uploads")));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/inventory", inventory);
app.use("/api/services", serviceRoutes);
app.use("/api/v1/appoiment", appoinment);
app.use("/api/v1/package", Package);
app.use("/api/v1/feedback", feedback);
app.use("/api/v1/user", userRoutes);

const PORT = 7001;

dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });