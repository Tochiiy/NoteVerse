import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import { ArrowLeft, ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import {
  isCloudinaryConfigured,
  uploadSingleFileToCloudinaryWithProgress,
} from "../features/media/cloudinaryUpload";
import { useAuth } from "../features/auth/AuthContext";

const MAX_EMPTY_ATTEMPTS = 3;
const SAVE_LOCK_SECONDS = 15;

function CreatePage() {
  const { authHeaders } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [videoUrls, setVideoUrls] = useState([]);
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [manualVideoUrl, setManualVideoUrl] = useState("");
  const [uploadItems, setUploadItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [emptySubmitAttempts, setEmptySubmitAttempts] = useState(0);
  const [saveLockUntil, setSaveLockUntil] = useState(0);
  const [lockSecondsLeft, setLockSecondsLeft] = useState(0);

  const tags = useMemo(
    () =>
      tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tagsInput],
  );

  useEffect(() => {
    if (!saveLockUntil) {
      setLockSecondsLeft(0);
      return;
    }

    const updateCountdown = () => {
      const seconds = Math.max(
        0,
        Math.ceil((saveLockUntil - Date.now()) / 1000),
      );
      setLockSecondsLeft(seconds);
    };

    updateCountdown();
    const timerId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timerId);
  }, [saveLockUntil]);

  const isSaveLocked = lockSecondsLeft > 0;

  const addManualMedia = (type) => {
    const rawValue = type === "image" ? manualImageUrl : manualVideoUrl;
    const url = rawValue.trim();

    if (!url) {
      toast.error("Enter a valid URL first");
      return;
    }

    if (type === "image") {
      setImageUrls((prev) => [...prev, url]);
      setManualImageUrl("");
    } else {
      setVideoUrls((prev) => [...prev, url]);
      setManualVideoUrl("");
    }
  };

  const removeMediaAt = (type, index) => {
    if (type === "image") {
      setImageUrls((prev) =>
        prev.filter((_, currentIndex) => currentIndex !== index),
      );
      return;
    }

    setVideoUrls((prev) =>
      prev.filter((_, currentIndex) => currentIndex !== index),
    );
  };

  const moveMedia = (type, index, direction) => {
    const updateList = (list) => {
      const nextIndex = direction === "up" ? index - 1 : index + 1;

      if (nextIndex < 0 || nextIndex >= list.length) {
        return list;
      }

      const next = [...list];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    };

    if (type === "image") {
      setImageUrls((prev) => updateList(prev));
      return;
    }

    setVideoUrls((prev) => updateList(prev));
  };

  const handleMediaUpload = async (event, resourceType) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    if (!isCloudinaryConfigured()) {
      toast.error("Cloudinary is not configured in frontend env");
      event.target.value = "";
      return;
    }

    try {
      setIsUploadingMedia(true);
      const pendingItems = files.map((file) => ({
        id: `${resourceType}-${file.name}-${crypto.randomUUID()}`,
        name: file.name,
        progress: 0,
        status: "uploading",
      }));

      setUploadItems((prev) => [...pendingItems, ...prev]);

      const uploads = pendingItems.map(async (item, index) => {
        const file = files[index];

        try {
          const uploadedUrl = await uploadSingleFileToCloudinaryWithProgress(
            file,
            resourceType,
            (percent) => {
              setUploadItems((prev) =>
                prev.map((entry) =>
                  entry.id === item.id
                    ? { ...entry, progress: percent }
                    : entry,
                ),
              );
            },
          );

          if (resourceType === "image") {
            setImageUrls((prev) => [...prev, uploadedUrl]);
          } else {
            setVideoUrls((prev) => [...prev, uploadedUrl]);
          }

          setUploadItems((prev) =>
            prev.map((entry) =>
              entry.id === item.id
                ? { ...entry, progress: 100, status: "done" }
                : entry,
            ),
          );
        } catch (err) {
          setUploadItems((prev) =>
            prev.map((entry) =>
              entry.id === item.id
                ? {
                    ...entry,
                    status: "error",
                    error: err?.message || "Upload failed",
                  }
                : entry,
            ),
          );
        }
      });

      await Promise.allSettled(uploads);
      toast.success("Media upload finished");
    } catch (err) {
      toast.error(err?.message || "Media upload failed");
    } finally {
      setIsUploadingMedia(false);
      event.target.value = "";
    }
  };

  const handleClear = () => {
    setTitle("");
    setContent("");
    setTagsInput("");
    setImageUrls([]);
    setVideoUrls([]);
    setManualImageUrl("");
    setManualVideoUrl("");
    setUploadItems([]);
    toast.success("Form cleared");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (isSaving || isSaveLocked) {
      if (isSaveLocked) {
        toast.error(
          `Too many empty attempts. Try again in ${lockSecondsLeft}s.`,
        );
      }
      return;
    }

    if (!title.trim() || !content.trim()) {
      const nextAttempts = emptySubmitAttempts + 1;
      setEmptySubmitAttempts(nextAttempts);

      if (nextAttempts >= MAX_EMPTY_ATTEMPTS) {
        setSaveLockUntil(Date.now() + SAVE_LOCK_SECONDS * 1000);
        setEmptySubmitAttempts(0);
        toast.error(
          `Too many empty saves. Save is locked for ${SAVE_LOCK_SECONDS} seconds.`,
        );
        return;
      }

      toast.error(
        `Title and content are required (${MAX_EMPTY_ATTEMPTS - nextAttempts} tries left before lock).`,
      );
      return;
    }

    setEmptySubmitAttempts(0);

    try {
      setIsSaving(true);
      await axios.post(
        "/api/notes",
        {
          title: title.trim(),
          content: content.trim(),
          tags,
          imageUrls,
          videoUrls,
        },
        {
          headers: authHeaders,
        },
      );

      toast.success("Note created successfully");
      setTitle("");
      setContent("");
      setTagsInput("");
      setImageUrls([]);
      setVideoUrls([]);
      setManualImageUrl("");
      setManualVideoUrl("");
      setUploadItems([]);
      navigate("/");
    } catch (err) {
      if (err?.response?.status === 429) {
        const retryAfter = err.response?.data?.retryAfter;
        toast.error(
          retryAfter
            ? `Too many requests. Try again in ${retryAfter}s.`
            : "Too many requests. Please try again shortly.",
        );
      } else {
        toast.error(err?.response?.data?.error || "Failed to save note");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen pb-36 pt-10">
      <div className="mx-auto max-w-5xl px-4">
        <section className="relative overflow-hidden rounded-3xl border border-base-content/10 bg-base-100/75 p-8 shadow-2xl backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
          <div className="relative z-10">
            <Link
              to="/"
              className="btn btn-ghost btn-sm rounded-xl"
              aria-label="Back to notes"
            >
              <ArrowLeft size={16} />
              Back to Notes
            </Link>

            <span className="badge badge-primary badge-outline rounded-xl px-3 py-3">
              Create
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-base-content md:text-4xl">
              Create Note
            </h1>
            <p className="mt-3 max-w-2xl text-base-content/70">
              Draft your next note with a clean editor layout. Fill the form and
              save when ready.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSave}>
              {isSaveLocked && (
                <div className="rounded-xl border border-error/40 bg-error/10 px-4 py-3 text-sm text-base-content">
                  Save temporarily locked due to repeated empty submissions. Try
                  again in{" "}
                  <span className="font-semibold">{lockSecondsLeft}s</span>.
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <label className="form-control w-full md:col-span-2">
                  <div className="label">
                    <span className="label-text text-sm font-semibold text-base-content">
                      Title
                    </span>
                    <span className="label-text-alt text-xs text-base-content/60">
                      {title.length}/120
                    </span>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(event) =>
                      setTitle(event.target.value.slice(0, 120))
                    }
                    disabled={isSaving}
                    className="input input-bordered w-full rounded-xl bg-base-100/80"
                    placeholder="Enter a clear note title"
                  />
                </label>

                <label className="form-control w-full md:col-span-2">
                  <div className="label">
                    <span className="label-text text-sm font-semibold text-base-content">
                      Content
                    </span>
                    <span className="label-text-alt text-xs text-base-content/60">
                      {content.length} chars
                    </span>
                  </div>
                  <textarea
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    disabled={isSaving}
                    className="textarea textarea-bordered min-h-48 w-full rounded-xl bg-base-100/80"
                    placeholder="Write your note details here..."
                  />
                </label>

                <label className="form-control w-full md:col-span-2">
                  <div className="label">
                    <span className="label-text text-sm font-semibold text-base-content">
                      Tags
                    </span>
                    <span className="label-text-alt text-xs text-base-content/60">
                      Comma separated
                    </span>
                  </div>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(event) => setTagsInput(event.target.value)}
                    disabled={isSaving}
                    className="input input-bordered w-full rounded-xl bg-base-100/80"
                    placeholder="work, idea, urgent"
                  />
                </label>

                <label className="form-control w-full md:col-span-2">
                  <div className="label">
                    <span className="label-text text-sm font-semibold text-base-content">
                      Add Image URL
                    </span>
                  </div>
                  <div className="join w-full">
                    <input
                      type="url"
                      value={manualImageUrl}
                      onChange={(event) =>
                        setManualImageUrl(event.target.value)
                      }
                      disabled={isSaving || isUploadingMedia}
                      className="input input-bordered join-item w-full rounded-l-xl bg-base-100/80"
                      placeholder="https://...jpg"
                    />
                    <button
                      type="button"
                      className="btn btn-outline join-item rounded-r-xl"
                      onClick={() => addManualMedia("image")}
                      disabled={isSaving || isUploadingMedia}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </label>

                <label className="form-control w-full md:col-span-2">
                  <div className="label">
                    <span className="label-text text-sm font-semibold text-base-content">
                      Upload Images
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => handleMediaUpload(event, "image")}
                    disabled={isSaving || isUploadingMedia}
                    className="file-input file-input-bordered w-full rounded-xl"
                  />
                </label>

                <label className="form-control w-full md:col-span-2">
                  <div className="label">
                    <span className="label-text text-sm font-semibold text-base-content">
                      Add Video URL
                    </span>
                  </div>
                  <div className="join w-full">
                    <input
                      type="url"
                      value={manualVideoUrl}
                      onChange={(event) =>
                        setManualVideoUrl(event.target.value)
                      }
                      disabled={isSaving || isUploadingMedia}
                      className="input input-bordered join-item w-full rounded-l-xl bg-base-100/80"
                      placeholder="https://...mp4"
                    />
                    <button
                      type="button"
                      className="btn btn-outline join-item rounded-r-xl"
                      onClick={() => addManualMedia("video")}
                      disabled={isSaving || isUploadingMedia}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </label>

                <label className="form-control w-full md:col-span-2">
                  <div className="label">
                    <span className="label-text text-sm font-semibold text-base-content">
                      Upload Videos
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(event) => handleMediaUpload(event, "video")}
                    disabled={isSaving || isUploadingMedia}
                    className="file-input file-input-bordered w-full rounded-xl"
                  />
                </label>
              </div>

              <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-4 shadow-md">
                <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                  Attachments
                </p>

                <div className="mt-3 space-y-3">
                  {imageUrls.map((url, index) => (
                    <div
                      key={`img-${url}-${index}`}
                      className="flex items-center gap-2 rounded-xl border border-base-content/10 p-2"
                    >
                      <img
                        src={url}
                        alt={`Image ${index + 1}`}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <span className="flex-1 truncate text-sm">{url}</span>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => moveMedia("image", index, "up")}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => moveMedia("image", index, "down")}
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => removeMediaAt("image", index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {videoUrls.map((url, index) => (
                    <div
                      key={`vid-${url}-${index}`}
                      className="flex items-center gap-2 rounded-xl border border-base-content/10 p-2"
                    >
                      <span className="badge badge-outline">Video</span>
                      <span className="flex-1 truncate text-sm">{url}</span>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => moveMedia("video", index, "up")}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => moveMedia("video", index, "down")}
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => removeMediaAt("video", index)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {imageUrls.length === 0 && videoUrls.length === 0 && (
                    <span className="text-sm text-base-content/60">
                      No attachments added yet.
                    </span>
                  )}
                </div>
              </div>

              {uploadItems.length > 0 && (
                <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-4 shadow-md">
                  <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                    Upload Progress
                  </p>
                  <div className="mt-3 space-y-2">
                    {uploadItems.map((item) => (
                      <div key={item.id}>
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="truncate pr-2">{item.name}</span>
                          <span>
                            {item.status === "error"
                              ? "Failed"
                              : `${item.progress}%`}
                          </span>
                        </div>
                        <progress
                          className={`progress w-full ${
                            item.status === "error"
                              ? "progress-error"
                              : "progress-primary"
                          }`}
                          value={item.status === "error" ? 100 : item.progress}
                          max="100"
                        />
                        {item.status === "error" && (
                          <p className="mt-1 text-xs text-error">
                            {item.error}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-4 shadow-md">
                <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                  Tag Preview
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.length > 0 ? (
                    tags.map((tag, index) => (
                      <span
                        key={`${tag}-${index}`}
                        className="badge badge-outline"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-base-content/60">
                      Add tags to preview them here.
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="btn btn-primary rounded-xl px-6"
                  disabled={isSaving || isSaveLocked || isUploadingMedia}
                >
                  {isSaving && (
                    <span className="loading loading-spinner loading-sm" />
                  )}
                  {isSaving
                    ? "Saving..."
                    : isSaveLocked
                      ? `Locked (${lockSecondsLeft}s)`
                      : isUploadingMedia
                        ? "Uploading media..."
                        : "Save Note"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost rounded-xl"
                  onClick={handleClear}
                  disabled={isSaving}
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

export default CreatePage;
