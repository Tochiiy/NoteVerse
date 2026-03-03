import Note from "../../models/Note.js";

// GET all notes (exclude archived by default)
// Query parameters:
//   includeArchived=true   -> return both archived and active notes
//   sort=asc|desc           -> order by creation time (default desc)
//   q=keyword               -> search by title/content/tags
export const getNotes = async (req, res) => {
  try {
    const includeArchived = req.query.includeArchived === "true";
    const sortOrder = req.query.sort === "asc" ? 1 : -1;
    const searchTerm =
      typeof req.query.q === "string" ? req.query.q.trim() : "";
    const query = includeArchived
      ? { user: req.user._id }
      : { user: req.user._id, archived: false };

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, "i");
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex },
      ];
    }

    const notes = await Note.find(query)
      .select(
        "title content tags imageUrls videoUrls pinned archived createdAt updatedAt",
      )
      .sort({ createdAt: sortOrder });
    res.json({ notes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create a new note
export const createNote = async (req, res) => {
  try {
    const { title, content, tags, imageUrls, videoUrls, pinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "title and content are required" });
    }
    const note = new Note({
      user: req.user._id,
      title,
      content,
      tags: tags || [],
      imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
      videoUrls: Array.isArray(videoUrls) ? videoUrls : [],
      pinned: Boolean(pinned),
    });
    await note.save();
    res.status(201).json({ message: "Note created successfully", note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET a single note by id
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOne({ _id: id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT update a note by id
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, imageUrls, videoUrls, pinned } = req.body;
    const updatePayload = {};

    if (title !== undefined) {
      updatePayload.title = title;
    }
    if (content !== undefined) {
      updatePayload.content = content;
    }
    if (tags !== undefined) {
      updatePayload.tags = tags;
    }
    if (imageUrls !== undefined) {
      updatePayload.imageUrls = Array.isArray(imageUrls) ? imageUrls : [];
    }
    if (videoUrls !== undefined) {
      updatePayload.videoUrls = Array.isArray(videoUrls) ? videoUrls : [];
    }
    if (pinned !== undefined) {
      updatePayload.pinned = Boolean(pinned);
    }

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ error: "No fields provided for update" });
    }

    const note = await Note.findOneAndUpdate(
      { _id: id, user: req.user._id },
      updatePayload,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ message: "Note updated successfully", note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE remove a note by id (permanent delete)
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndDelete({ _id: id, user: req.user._id });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ message: "Note deleted successfully", note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
