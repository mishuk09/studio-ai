import { CalendarDays, Copy, Newspaper, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Success from "../utills/Success";

export default function Allnews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", variant: "success" });
  const [selectedDate, setSelectedDate] = useState(null);

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast({ open: true, message: "Copied to clipboard", variant: "success" });
    } catch (copyError) {
      console.error("Copy failed:", copyError);
      setToast({ open: true, message: "Copy failed", variant: "error" });
    }
  };

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const fetchNews = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please sign in before viewing saved news.");
      setNews([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://pressai.info/api/user/news", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch news.");
      }

      const sortedNews = Array.isArray(data?.news)
        ? [...data.news].sort((left, right) => {
            const leftTime = new Date(left?.created_at || 0).getTime();
            const rightTime = new Date(right?.created_at || 0).getTime();
            return rightTime - leftTime;
          })
        : [];

      setNews(sortedNews);
    } catch (fetchError) {
      console.error("Error fetching news:", fetchError);
      setError(fetchError.message || "Something went wrong while fetching news.");
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const groupedByDate = useMemo(() => {
    const map = {};
    news.forEach((item) => {
      const d = item?.created_at ? new Date(item.created_at) : null;
      const key = d ? d.toISOString().slice(0, 10) : "unknown";
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    const keys = Object.keys(map).sort((a, b) => (a < b ? 1 : -1)); // newest-first
    return { map, keys };
  }, [news]);

  useEffect(() => {
    if (groupedByDate.keys.length > 0) {
      setSelectedDate((current) => current || groupedByDate.keys[0]);
    } else {
      setSelectedDate(null);
    }
  }, [groupedByDate]);

  const displayedNews =
    selectedDate === "ALL"
      ? news
      : selectedDate && groupedByDate.map[selectedDate]
        ? groupedByDate.map[selectedDate]
        : [];

  return (
    <div className="min-h-screen bg-[var(--primary-color)] px-4 py-10 text-white sm:px-6 lg:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="text-center">
          {/* <div className="mb-4 inline-flex rounded-lg border border-[var(--border-color)] bg-cyan-400/10 px-4 py- text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
            Saved News
          </div> */}
          <h1 className="text-4xl font-bold text-white md:text-5xl">All News</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-300 ">
            View the news items saved to your account and copy any part you need.
          </p>
        </div>

        {groupedByDate.keys.length > 0 && (
          <div className="flex gap-2 justify-between">
            <div className=" mt-12 w-full rounded-lg border border-[var(--border-color)] bg-slate-900/70 p-2 backdrop-blur">
              <div className="flex flex-wrap-auto items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDate("ALL")}
                  className={`whitespace-nowrap inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    selectedDate === "ALL"
                      ? "bg-[var(--primary-color)] text-white shadow-lg ring-1 ring-blue-600 shadow-blue-600/20"
                      : "bg-white/5 text-slate-200 border border-white/5 hover:bg-white/10"
                  }`}
                >
                  <CalendarDays size={14} />
                  <span>All</span>
                  <span className="ml-2 rounded-lg bg-white/5 px-2 py-0.5 text-xs">
                    {news.length}
                  </span>
                </button>

                {groupedByDate.keys.map((dateKey) => {
                  const label = new Date(dateKey).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const count = groupedByDate.map[dateKey]?.length || 0;
                  const active = selectedDate === dateKey;
                  return (
                    <button
                      key={dateKey}
                      onClick={() => setSelectedDate(dateKey)}
                      className={`whitespace-nowrap inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-[var(--primary-color)] text-white shadow-lg ring-1 ring-blue-600 shadow-blue-600/20"
                          : "bg-white/5 text-slate-200 border border-white/5 hover:bg-white/10"
                      }`}
                    >
                      <CalendarDays size={14} />
                      <span>{label}</span>
                      <span className="ml-2 rounded-lg bg-white/5 px-2 py-0.5 text-xs">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className=" mt-12 rounded-lg border border-[var(--border-color)] bg-slate-900/70 p-2 backdrop-blur">
              <button
                type="button"
                onClick={fetchNews}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-slate-900/70 p-2 backdrop-blur transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-200 shadow-lg shadow-black/10">
            <p className="font-semibold">Error</p>
            <p className="text-sm text-red-100/90">{error}</p>
          </div>
        )}

        {loading && (
          <div className="rounded-lg border border-white/10 bg-[var(--secondary-color)] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-4 inline-flex rounded-lg border border-white/10 bg-white/5 p-4 text-cyan-200">
              <Newspaper size={28} />
            </div>
            <p className="text-lg font-semibold text-white">Loading saved news...</p>
            <p className="mt-2 text-sm text-slate-400">Fetching items from your account.</p>
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <div className="rounded-lg border border-white/10 bg-[var(--secondary-color)] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-4 inline-flex rounded-lg border border-white/10 bg-white/5 p-4 text-cyan-200">
              <Newspaper size={28} />
            </div>
            <p className="text-lg font-semibold text-white">No saved news found</p>
            <p className="mt-2 text-sm text-slate-400">
              Generate and save a news item from the Rewrite page first.
            </p>
          </div>
        )}

        {displayedNews.length > 0 && (
          <div className="grid gap-6">
            {displayedNews.map((item, index) => {
              const title = item.mainTitle || item.title || "Untitled News";
              const thumbnailTitle = item.thumbnailTitle || item.thumbnail_title || "";
              const description = item.description || "";
              const tags = Array.isArray(item.tags) ? item.tags : [];

              return (
                <article
                  key={`${title}-${index}`}
                  className="rounded-lg border border-white/10 bg-[var(--secondary-color)] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8"
                >
                  <div className="mb-6 border-b border-white/10 pb-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-3">
                        <h2 className="text-xl font-bold leading-tight text-[var(--primary-text-color)]">
                          {title}
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(title)}
                        className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                        aria-label="Copy news title"
                      >
                        <Copy size={14} />
                      </button>
                    </div>

                    {thumbnailTitle && (
                      <div className="mt-6 inline-flex w-full flex-col rounded-lg border border-[var(--border-color)] bg-[var(--primary-color)] px-4 py-3">
                        <div className="mb-1 flex items-center justify-between gap-3">
                          <span className="text-xs font-bold   tracking-wider text-cyan-300">
                            Thumbnail Title
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(thumbnailTitle)}
                            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                            aria-label="Copy thumbnail title"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                        <p className=" font-semibold text-[var(--primary-text-color)]">
                          {thumbnailTitle}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-6">
                    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--primary-color)] p-5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                          Description
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(description)}
                          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                          aria-label="Copy description"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--text-color)] text-justify">
                        {description}
                      </p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-[var(--primary-color)] p-5">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                          Tags
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              tags.map((tag) => `#${String(tag).replace(/\s+/g, "")}`).join(" ")
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                          aria-label="Copy tags"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tags.length > 0 ? (
                          tags.map((tag, tagIndex) => (
                            <span
                              key={`${tag}-${tagIndex}`}
                              className="inline-flex items-center rounded-lg border border-[var(--border-color)] bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-100"
                            >
                              #{String(tag).replace(/\s+/g, "")}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-400">No tags available.</span>
                        )}
                      </div>
                    </div>

                    {item.created_at && (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <CalendarDays size={16} />
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Success
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast((current) => ({ ...current, open: false }))}
      />
    </div>
  );
}
