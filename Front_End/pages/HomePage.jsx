import { useEffect, useMemo, useState } from "react";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import RateLimiter from "../components/RateLimiter";
import RainEffect from "../components/RainEffect";
import NoteCard from "../components/NoteCard";
import { useAuth } from "../features/auth/AuthContext";

// Home dashboard page:
// - fetches notes from backend
// - shows loading/error states
// - displays rate-limit warning when backend returns 429
function HomePage() {
  const { authHeaders } = useAuth();
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(undefined);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTagsInput, setEditTagsInput] = useState("");
  const [editImageUrlsInput, setEditImageUrlsInput] = useState("");
  const [editVideoUrlsInput, setEditVideoUrlsInput] = useState("");
  const currentDate = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [],
  );

  const sortedNotes = useMemo(
    () =>
      [...notes].sort((a, b) => {
        if (Boolean(a?.pinned) !== Boolean(b?.pinned)) {
          return Number(Boolean(b?.pinned)) - Number(Boolean(a?.pinned));
        }

        return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
      }),
    [notes],
  );

  const fetchNotes = async (query = "") => {
    // Start request cycle and clear previous non-rate-limit errors.
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set("q", query.trim());
      }

      // Backend currently returns { notes: [...] }.
      const response = await axios.get(
        `/api/notes${params.toString() ? `?${params.toString()}` : ""}`,
        { headers: authHeaders },
      );
      const data = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.notes)
          ? response.data.notes
          : [];

      setNotes(data);
      setIsRateLimited(false);
      setRetryAfter(undefined);
    } catch (err) {
      if (err?.response?.status === 429) {
        setIsRateLimited(true);
        setRetryAfter(err.response?.data?.retryAfter);
      } else {
        toast.error("Failed to load notes. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceId = window.setTimeout(() => {
      fetchNotes(searchTerm);
    }, 350);

    return () => window.clearTimeout(debounceId);
  }, [searchTerm, authHeaders]);

  const handleDeleteNote = async (noteId) => {
    if (!noteId) {
      return;
    }

    const shouldDelete = window.confirm(
      "Are you sure you want to delete this note?",
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await axios.delete(`/api/notes/${noteId}`, {
        headers: authHeaders,
      });
      setNotes((prev) => prev.filter((note) => note._id !== noteId));
      toast.success("Note removed");
    } catch (err) {
      if (err?.response?.status === 429) {
        setIsRateLimited(true);
        setRetryAfter(err.response?.data?.retryAfter);
      } else {
        toast.error(err?.response?.data?.error || "Failed to delete note");
      }
    }
  };

  const handleEditNote = (noteId) => {
    if (!noteId) {
      return;
    }

    const currentNote = notes.find((note) => note._id === noteId);

    if (!currentNote) {
      toast.error("Note not found");
      return;
    }

    setEditingNoteId(noteId);
    setEditTitle(currentNote.title || "");
    setEditContent(currentNote.content || "");
    setEditTagsInput(
      Array.isArray(currentNote.tags) ? currentNote.tags.join(", ") : "",
    );
    setEditImageUrlsInput(
      Array.isArray(currentNote.imageUrls)
        ? currentNote.imageUrls.join(", ")
        : "",
    );
    setEditVideoUrlsInput(
      Array.isArray(currentNote.videoUrls)
        ? currentNote.videoUrls.join(", ")
        : "",
    );
  };

  const closeEditModal = () => {
    setEditingNoteId(null);
    setEditTitle("");
    setEditContent("");
    setEditTagsInput("");
    setEditImageUrlsInput("");
    setEditVideoUrlsInput("");
  };

  const handleSaveEditedNote = async (event) => {
    event.preventDefault();

    if (!editingNoteId) {
      return;
    }

    if (!editTitle.trim() || !editContent.trim()) {
      toast.error("Title and content are required");
      return;
    }

    const nextTags = editTagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const nextImageUrls = editImageUrlsInput
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);

    const nextVideoUrls = editVideoUrlsInput
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);

    try {
      setIsSavingEdit(true);
      const response = await axios.put(
        `/api/notes/${editingNoteId}`,
        {
          title: editTitle.trim(),
          content: editContent.trim(),
          tags: nextTags,
          imageUrls: nextImageUrls,
          videoUrls: nextVideoUrls,
        },
        {
          headers: authHeaders,
        },
      );

      const updatedNote = response.data?.note;

      if (!updatedNote) {
        toast.error("Failed to update note");
        return;
      }

      setNotes((prev) =>
        prev.map((note) => (note._id === editingNoteId ? updatedNote : note)),
      );
      toast.success("Note updated");
      closeEditModal();
    } catch (err) {
      if (err?.response?.status === 429) {
        setIsRateLimited(true);
        setRetryAfter(err.response?.data?.retryAfter);
      } else {
        toast.error(err?.response?.data?.error || "Failed to edit note");
      }
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleTogglePin = async (noteId) => {
    if (!noteId) {
      return;
    }

    const currentNote = notes.find((note) => note._id === noteId);

    if (!currentNote) {
      toast.error("Note not found");
      return;
    }

    try {
      const response = await axios.put(
        `/api/notes/${noteId}`,
        {
          pinned: !Boolean(currentNote.pinned),
        },
        {
          headers: authHeaders,
        },
      );

      const updatedNote = response.data?.note;

      if (!updatedNote) {
        toast.error("Failed to update pin");
        return;
      }

      setNotes((prev) =>
        prev.map((note) => (note._id === noteId ? updatedNote : note)),
      );
      toast.success(updatedNote.pinned ? "Note pinned" : "Note unpinned");
    } catch (err) {
      if (err?.response?.status === 429) {
        setIsRateLimited(true);
        setRetryAfter(err.response?.data?.retryAfter);
      } else {
        toast.error(err?.response?.data?.error || "Failed to toggle pin");
      }
    }
  };

  return (
    <main className="min-h-screen pb-36 pt-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6">
          <RainEffect />
        </div>

        <section className="relative overflow-hidden rounded-3xl border border-base-content/10 bg-base-100/70 p-6 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-base-content md:text-4xl">
              Home Page
            </h2>
            <p className="mt-2 text-base-content/70">
              Welcome to NoteVerse. Start creating and managing your notes.
            </p>
            <div className="mt-3">
              <span className="badge badge-outline rounded-xl px-3 py-3">
                Today: {currentDate}
              </span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                className="btn btn-primary rounded-xl shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                onClick={() => fetchNotes(searchTerm)}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Refresh Notes"}
              </button>
              <span className="badge badge-neutral badge-lg rounded-xl px-4 py-4 shadow-md">
                Notes: {sortedNotes.length}
              </span>
            </div>

            <div className="mt-4">
              <label className="form-control w-full">
                <div className="label pb-1">
                  <span className="label-text text-sm font-medium text-base-content/80">
                    Search notes by title, content, or tags
                  </span>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="input input-bordered w-full rounded-xl bg-base-100/80"
                  placeholder="Search for contents..."
                />
              </label>
            </div>
          </div>
        </section>

        {/* Rate-limit warning UI */}
        {isRateLimited && (
          <div className="mt-6">
            <RateLimiter retryAfter={retryAfter} />
          </div>
        )}

        {!isRateLimited && isLoading && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-base-content/10 bg-base-100/70 p-5 shadow-md"
              >
                <div className="skeleton h-5 w-2/3" />
                <div className="mt-3 skeleton h-4 w-full" />
                <div className="mt-2 skeleton h-4 w-5/6" />
              </div>
            ))}
          </div>
        )}

        {/* Notes grid (hidden while loading or rate-limited) */}
        {!isRateLimited && !isLoading && sortedNotes.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onDelete={handleDeleteNote}
                onEdit={handleEditNote}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        )}

        {!isRateLimited && !isLoading && sortedNotes.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed border-base-content/20 bg-base-100/60 p-8 text-center shadow-md">
            <h3 className="text-lg font-semibold text-base-content">
              {searchTerm.trim() ? "No matching notes" : "No notes yet"}
            </h3>
            <p className="mt-2 text-sm text-base-content/70">
              {searchTerm.trim()
                ? "Try another keyword for your search."
                : "Create your first note to get started."}
            </p>
          </div>
        )}

        {editingNoteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-base-content/10 bg-base-100 p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-base-content">Edit Note</h3>
              <p className="mt-1 text-sm text-base-content/70">
                Update your note content and attachments.
              </p>

              <form className="mt-5 space-y-4" onSubmit={handleSaveEditedNote}>
                <label className="form-control w-full">
                  <div className="label pb-1">
                    <span className="label-text text-sm font-medium">
                      Title
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(event) => setEditTitle(event.target.value)}
                    className="input input-bordered w-full rounded-xl"
                    disabled={isSavingEdit}
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label pb-1">
                    <span className="label-text text-sm font-medium">
                      Content
                    </span>
                  </div>
                  <textarea
                    value={editContent}
                    onChange={(event) => setEditContent(event.target.value)}
                    className="textarea textarea-bordered min-h-32 w-full rounded-xl"
                    disabled={isSavingEdit}
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label pb-1">
                    <span className="label-text text-sm font-medium">
                      Tags (comma separated)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={editTagsInput}
                    onChange={(event) => setEditTagsInput(event.target.value)}
                    className="input input-bordered w-full rounded-xl"
                    placeholder="work, ideas"
                    disabled={isSavingEdit}
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label pb-1">
                    <span className="label-text text-sm font-medium">
                      Image URLs (comma separated)
                    </span>
                  </div>
                  <textarea
                    value={editImageUrlsInput}
                    onChange={(event) =>
                      setEditImageUrlsInput(event.target.value)
                    }
                    className="textarea textarea-bordered min-h-20 w-full rounded-xl"
                    placeholder="https://... , https://..."
                    disabled={isSavingEdit}
                  />
                </label>

                <label className="form-control w-full">
                  <div className="label pb-1">
                    <span className="label-text text-sm font-medium">
                      Video URLs (comma separated)
                    </span>
                  </div>
                  <textarea
                    value={editVideoUrlsInput}
                    onChange={(event) =>
                      setEditVideoUrlsInput(event.target.value)
                    }
                    className="textarea textarea-bordered min-h-20 w-full rounded-xl"
                    placeholder="https://... , https://..."
                    disabled={isSavingEdit}
                  />
                </label>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="btn btn-ghost rounded-xl"
                    onClick={closeEditModal}
                    disabled={isSavingEdit}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-xl"
                    disabled={isSavingEdit}
                  >
                    {isSavingEdit ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default HomePage;
