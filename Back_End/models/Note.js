import mongoose from "mongoose";

// Note schema defines the shape and validation rules for each note document.
const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
    imageUrls: { type: [String], default: [] },
    videoUrls: { type: [String], default: [] },
    pinned: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Mongoose model used by controllers to query/create/update notes.
const Note = mongoose.model("Note", noteSchema);

export default Note;
