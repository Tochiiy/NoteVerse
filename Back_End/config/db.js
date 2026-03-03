import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Require a full MONGO_URI from env. Do not build or fall back to a
// hardcoded connection string in source — set `MONGO_URI` in environment
// for production, or use local dev environment variables to provide it.
const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
  if (!MONGO_URI) {
    console.error(
      "MongoDB connection not configured: set MONGO_URI or DB_USER/DB_PASS/DB_HOST/DB_NAME in environment",
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
