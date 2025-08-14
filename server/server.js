import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import cors from "cors";
import path from "path";
import AuthRoutes from "./routes/authRoutes.js";
import FolderRoutes from "./routes/folderRoutes.js";
import ImageRoutes from "./routes/imageRoutes.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/folders", FolderRoutes);
app.use("/api/v1/images", ImageRoutes);

// Database connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.error("DB connection error:", err));

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection! Shutting down...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});
