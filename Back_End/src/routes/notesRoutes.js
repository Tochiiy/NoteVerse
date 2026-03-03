import express from "express";
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notes.js";
import { protect } from "../../middleware/auth.js";

const router = express.Router();

router.use(protect);

// GET all notes (query param ?includeArchived=true to show archived)
router.get("/", getNotes);

// POST create a new note
router.post("/", createNote);

// GET a single note by id
router.get("/:id", getNoteById);

// PUT update a note by id
router.put("/:id", updateNote);

// DELETE a note permanently
router.delete("/:id", deleteNote);

export default router;
