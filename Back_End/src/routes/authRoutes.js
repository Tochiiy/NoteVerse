import express from "express";
import {
  deleteMyAccount,
  getMyProfile,
  loginUser,
  registerUser,
  updateMyProfile,
} from "../controllers/auth.js";
import { protect } from "../../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.delete("/me", protect, deleteMyAccount);

export default router;
