import { Copy, Database } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Success from "../utills/Success";

export default function Rewrite() {
  const location = useLocation();
  const [inputText, setInputText] = useState(location.state?.inputText || "");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", variant: "success" });

  const handleCopy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast({
        open: true,
        message: "Copied to clipboard",
        variant: "success",
      });
    } catch (copyError) {
      console.error("Copy failed:", copyError);
      setToast({
        open: true,
        message: "Copy failed",
        variant: "error",
      });
    }
  };

  const handleSaveNews = async () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token) {
      setToast({
        open: true,
        message: "Please sign in before saving news.",
        variant: "error",
      });
      return;
    }

    if (!email) {
      setToast({
        open: true,
        message: "User email was not found. Please sign in again.",
        variant: "error",
      });
      return;
    }

    if (!result?.title || !result?.thumbnail_title || !result?.description) {
      setToast({
        open: true,
        message: "There is no generated news to save.",
        variant: "error",
      });
      return;
    }

    setSaving(true);

    try {
      // const response = await fetch("https://pressai.info/api/user/news", {
      const response = await fetch("https://pressai.info/api/user/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          mainTitle: result.title,
          thumbnailTitle: result.thumbnail_title,
          description: result.description,
          tags: result.tags || [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({
          open: true,
          message: data?.error || "Failed to save news.",
          variant: "error",
        });
        return;
      }

      setToast({
        open: true,
        message: "News saved successfully.",
        variant: "success",
      });
    } catch (saveError) {
      console.error("Error saving news:", saveError);
      setToast({
        open: true,
        message: "Network error: could not save the news.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // আপনার n8n প্রোডাকশন ওয়েবহুক ইউআরএল
      const response = await fetch("https://n8nflow.online/webhook/youtube-to-news", {
        method: "POST",
        headers: {
          // n8n এ {{ $json.body }} হিসেবে ধরতে Content-Type text/plain রাখা হয়েছে
          "Content-Type": "text/plain",
        },
        body: inputText,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setToast({
        open: true,
        message: "Generate successful.",
        variant: "success",
      });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-color)] px-4 py-10 text-white sm:px-6 lg:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white md:text-4xl">Rewrite Your News Content</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300  ">
            Paste raw news or a YouTube transcript and turn it into a polished, structured news
            format.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-[var(--border-color)] bg-[var(--secondary-color)] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8"
        >
          <label htmlFor="news-input" className="mb-4 block text-sm font-semibold text-slate-200">
            Raw News Content
          </label>
          <textarea
            id="news-input"
            rows={10}
            className="sidebar-scrollbar text-sm  min-h-24 h-24 max-h-100 w-full outline-none rounded-lg border border-[var(--border-color)] bg-[var(--primary-color)] px-4 py-3 text-[var(--text-color)] placeholder:text-[var(--text-color)] placeholder:text-xs transition  "
            placeholder="রাজধানীর বাংলাবাজারে তাজিয়ামি ছেলে..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
          />

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-all duration-200 ${
                loading || !inputText.trim()
                  ? "cursor-not-allowed bg-slate-600/70"
                  : "bg-blue-500 shadow-lg shadow-blue-600/20 hover:bg-blue-600"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Generate News"
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 shadow-lg shadow-black/10">
            <p className="font-semibold">Error</p>
            <p className="text-sm text-red-100/90">{error}</p>
          </div>
        )}

        {result && (
          <section className="rounded-lg border border-[var(--border-color)] bg-[var(--secondary-color)] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8 animate-fade-in-up">
            <div className="mb-6  border-b border-[var(--border-color)] pb-6 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-2xl font-bold leading-tight text-[var(--primary-text-color)] md:text-2xl">
                    {result.title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.title || "")}
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-white/5 px-3 py-2 text-xs font-semibold text-[var(--primary-text-color)] transition hover:bg-white/10 hover:text-white"
                    aria-label="Copy title"
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSaveNews}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Database size={12} /> {saving ? "Saving..." : "Save News"}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(result.thumbnail_title || "")}
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                  aria-label="Copy thumbnail title"
                >
                  <Copy size={12} />
                  Copy
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--primary-color)] p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Description
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.description || "")}
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                    aria-label="Copy description"
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--text-color)] text-justify">
                  {result.description}
                </p>
              </div>

              <div className="inline-flex w-full flex-col rounded-xl border border-[var(--border-color)] bg-[var(--primary-color)] px-4 py-3">
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    Thumbnail Title
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.thumbnail_title || "")}
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                    aria-label="Copy thumbnail title"
                  >
                    <Copy size={12} />
                    Copy
                  </button>
                </div>
                <p className="text-lg font-semibold text-[var(--primary-text-color)]">
                  {result.thumbnail_title}
                </p>
              </div>
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--primary-color)] p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Tags
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(result.tags?.map((tag) => `#${tag.replace(/\s+/g, "")}`).join(" "))
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-white/5 px-3 py-1.5 text-xs font-semibold text-[var(--primary-text-color)] transition hover:bg-white/10 hover:text-white"
                    aria-label="Copy tags"
                  >
                    <Copy size={12} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-lg border border-[var(--border-color)] bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-100"
                    >
                      # {tag.replace(/\s+/g, "")}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--primary-color)] p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Keywords
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        result.keywords?.map((tag) => `#${tag.replace(/\s+/g, "")}`).join(" ")
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-color)] bg-white/5 px-3 py-1.5 text-xs font-semibold text-[var(--primary-text-color)] transition hover:bg-white/10 hover:text-white"
                    aria-label="Copy keywords"
                  >
                    <Copy size={12} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-lg border border-[var(--border-color)] bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-100"
                    >
                      {keyword.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
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
