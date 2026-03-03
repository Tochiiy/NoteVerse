import { useMemo, useState } from "react";
import { Pencil, Pin, Trash2, X } from "lucide-react";

function NoteCard({ note, onDelete, onEdit, onTogglePin }) {
  const [activeMedia, setActiveMedia] = useState(null);

  const mediaItems = useMemo(() => {
    const images = Array.isArray(note?.imageUrls)
      ? note.imageUrls.map((url) => ({ type: "image", url }))
      : [];
    const videos = Array.isArray(note?.videoUrls)
      ? note.videoUrls.map((url) => ({ type: "video", url }))
      : [];
    return [...images, ...videos];
  }, [note?.imageUrls, note?.videoUrls]);

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl border border-base-content/10 bg-base-100/85 p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative z-10">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="badge badge-primary badge-outline">Note</span>
              <button
                type="button"
                className={`btn btn-xs rounded-lg ${
                  note?.pinned
                    ? "btn-warning text-warning-content"
                    : "btn-ghost"
                }`}
                onClick={() => onTogglePin?.(note?._id)}
                aria-label={note?.pinned ? "Unpin note" : "Pin note"}
              >
                <Pin size={14} fill={note?.pinned ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="btn btn-ghost btn-xs rounded-lg text-info hover:bg-info/10"
                onClick={() => onEdit?.(note?._id)}
                aria-label="Edit note"
              >
                <Pencil size={14} />
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-xs rounded-lg text-error hover:bg-error/10"
                onClick={() => onDelete?.(note?._id)}
                aria-label="Delete note"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-xs text-base-content/50">
              {note?.createdAt
                ? new Date(note.createdAt).toLocaleDateString()
                : ""}
            </span>
            {mediaItems.length > 0 && (
              <span className="badge badge-outline">
                Media: {mediaItems.length}
              </span>
            )}
          </div>

          <h3 className="line-clamp-2 text-lg font-bold tracking-tight text-base-content">
            {note?.title}
          </h3>
          <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-base-content/70">
            {note?.content}
          </p>

          {mediaItems.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {mediaItems.slice(0, 3).map((item, index) => (
                  <button
                    key={`${item.url}-${index}`}
                    type="button"
                    className="overflow-hidden rounded-lg border border-base-content/10"
                    onClick={() => setActiveMedia(item)}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={`Attachment ${index + 1}`}
                        className="h-20 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-20 items-center justify-center bg-base-200 text-xs font-semibold">
                        Video
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {mediaItems.length > 3 && (
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => setActiveMedia(mediaItems[0])}
                >
                  View all media
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {activeMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setActiveMedia(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-base-100 p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="btn btn-sm btn-circle absolute right-3 top-3"
              onClick={() => setActiveMedia(null)}
              aria-label="Close media viewer"
            >
              <X size={14} />
            </button>

            {activeMedia.type === "image" ? (
              <img
                src={activeMedia.url}
                alt="Selected media"
                className="max-h-[78vh] w-full rounded-xl object-contain"
              />
            ) : (
              <video
                className="max-h-[78vh] w-full rounded-xl"
                controls
                autoPlay
                src={activeMedia.url}
              />
            )}

            {mediaItems.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2 md:grid-cols-6">
                {mediaItems.map((item, index) => (
                  <button
                    key={`${item.url}-preview-${index}`}
                    type="button"
                    className={`overflow-hidden rounded-md border ${
                      item.url === activeMedia.url
                        ? "border-primary"
                        : "border-base-content/10"
                    }`}
                    onClick={() => setActiveMedia(item)}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={`Media ${index + 1}`}
                        className="h-12 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-12 items-center justify-center bg-base-200 text-[10px] font-semibold">
                        VIDEO
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default NoteCard;
