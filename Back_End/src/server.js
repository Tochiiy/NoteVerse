import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import notesRoutes from "./routes/notesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import resourcesRoutes from "./routes/resourcesRoutes.js";
import { connectDB } from "../config/db.js";
import { apiLimiter } from "../middleware/rateLimiter.js";

// Load environment variables from .env before using process.env values.
dotenv.config();

// Main Express application instance.
const app = express();

// Connect to MongoDB before starting the HTTP server.

// enable CORS for frontend
app.use(cors());

// parse JSON bodies for POST/PUT requests
app.use(express.json());

// apply rate limiting to all API routes
app.use("/api/", apiLimiter);

// logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

const PORT = process.env.PORT || 5000;

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// mount the notes router under the /api/notes prefix
app.use("/api/notes", notesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourcesRoutes);

connectDB().then(() => {
  // Start accepting requests only after DB connection succeeds.
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
