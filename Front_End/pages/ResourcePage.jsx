import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axios from "../lib/axios";

const CATEGORY_MAP = {
  book: "Best Book References",
  research: "Links to Search for Ideas",
  ai: "AI Suggestions & Assistants",
};

const DEFAULT_LINKS = {
  book: [
    {
      _id: "default-book-1",
      title: "Atomic Habits",
      description: "Practical system for building better routines and focus.",
      url: "https://jamesclear.com/atomic-habits",
      category: "book",
      active: true,
    },
  ],
  research: [
    {
      _id: "default-research-1",
      title: "Google Trends",
      description: "Discover rising topics and keywords for new ideas.",
      url: "https://trends.google.com/trends/",
      category: "research",
      active: true,
    },
  ],
  ai: [
    {
      _id: "default-ai-1",
      title: "ChatGPT",
      description: "Generate feature ideas, copy, and implementation plans.",
      url: "https://chat.openai.com/",
      category: "ai",
      active: true,
    },
  ],
};

function ResourcePage() {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const groupedLinks = useMemo(() => {
    return {
      book: links.filter((item) => item.category === "book"),
      research: links.filter((item) => item.category === "research"),
      ai: links.filter((item) => item.category === "ai"),
    };
  }, [links]);

  const fetchPublicLinks = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/resources");
      const data = Array.isArray(response.data?.links)
        ? response.data.links
        : [];
      setLinks(data);
    } catch {
      toast.error("Failed to load reference links");
      setLinks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicLinks();
  }, []);

  return (
    <main className="min-h-screen pb-36 pt-10">
      <div className="mx-auto max-w-6xl px-4">
        <section className="relative overflow-hidden rounded-3xl border border-base-content/10 bg-base-100/75 p-8 shadow-2xl backdrop-blur-xl md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-secondary/10 via-transparent to-primary/10" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-base-content md:text-4xl">
              Reference Center
            </h2>
            <p className="mt-3 max-w-2xl text-base-content/70">
              Curated books, research links, and AI tools to help you generate
              better ideas and build faster.
            </p>

            {isLoading && (
              <div className="mt-4 text-sm text-base-content/70">
                Loading reference links...
              </div>
            )}

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {Object.keys(CATEGORY_MAP).map((categoryKey) => {
                const items = groupedLinks[categoryKey];
                const fallbackItems = DEFAULT_LINKS[categoryKey];
                const renderItems = items.length > 0 ? items : fallbackItems;

                return (
                  <article
                    key={categoryKey}
                    className="rounded-2xl border border-base-content/10 bg-base-100/70 p-5 shadow-md"
                  >
                    <h3 className="text-lg font-semibold text-base-content">
                      {CATEGORY_MAP[categoryKey]}
                    </h3>

                    {renderItems.length > 0 ? (
                      <div className="mt-3 space-y-3">
                        {renderItems.map((item) => (
                          <a
                            key={item._id || `${item.title}-${item.url}`}
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-xl border border-base-content/10 p-3 transition-colors hover:bg-base-100"
                          >
                            <p className="font-medium text-base-content">
                              {item.title}
                            </p>
                            {item.description && (
                              <p className="mt-1 text-sm text-base-content/70">
                                {item.description}
                              </p>
                            )}
                          </a>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-base-content/70">
                        No links in this category yet.
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ResourcePage;
