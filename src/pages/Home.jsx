import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Success from "../utills/Success";

export default function Home() {
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFetchTranscript = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTranscript("");

    try {
      // 1. Send the link to your live n8n production webhook
      const response = await fetch("https://n8nflow.online/webhook/summarize-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: videoUrl }),
      });

      if (!response.ok) throw new Error("Failed to fetch data");

      // 2. Parse the exact JSON structure we see in image_36557a.jpg
      const data = await response.json();

      // 3. Save the 'transcript' key from the output into your UI state
      setTranscript(data.transcript);
    } catch (error) {
      console.error("Error:", error);
      setTranscript("Failed to retrieve transcript. Please check the URL.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTranscript = async () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token) {
      alert("Please sign in before saving the transcript.");
      return;
    }

    if (!email) {
      alert("User email was not found. Please sign in again.");
      return;
    }

    if (!transcript.trim()) {
      alert("There is no transcript to save.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("https://pressai.info/api/user/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          title: "No title found..",
          description: transcript,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          open: true,
          message: data?.error || "Failed to save transcript.",
          variant: "error",
        });
        return;
      }

      setToast({ open: true, message: "Transcript saved successfully.", variant: "success" });
    } catch (error) {
      console.error("Error saving transcript:", error);
      setToast({
        open: true,
        message: "Network error: could not save the transcript.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const [toast, setToast] = useState({ open: false, message: "", variant: "success" });

  return (
    <div className="min-h-screen     text-white">
      <main className="space-y-6">
        <form onSubmit={handleFetchTranscript}>
          <div className="rounded-lg border border-white/10 bg-[var(--primary-color)]  md:p-8 ">
            <label className="mb-4 block text-sm font-semibold text-slate-200">YouTube Video</label>
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                placeholder="Paste the YouTube video link, for example: https://www.youtube.com/watch?v=example"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-900/80 px-4 py-3   placeholder:text-slate-500 text-[var(--text-color)] focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-400/20"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex p-2 hover:bg-blue-600 transition items-center rounded-lg justify-center gap-2  bg-blue-500 text-white shadow-lg   shadow-blue-600/20"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⚙️</span>
                    Extracting...
                  </>
                ) : (
                  <>✨ Extract Text</>
                )}
              </button>
            </div>
          </div>
        </form>

        {transcript && (
          <section className="rounded-lg border border-white/5 bg-[var(--primary-color)] p-6 backdrop-blur-xl animate-fadeIn md:p-8">
            <h3 className="mb-4 text-xl font-bold text-cyan-300">Extracted Transcript</h3>
            <div>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className="lg:sticky lg:top-6 lg:w-40 lg:self-start">
                  <div className="flex flex-wrap gap-3 rounded-lg border border-white/10 bg-slate-950/''40'' p-4 lg:flex-col lg:gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(transcript);
                        setToast({
                          open: true,
                          message: "Copied to clipboard",
                          variant: "success",
                        });
                      }}
                      className="w-full rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/20"
                    >
                      Copy Text
                    </button>
                    {/* <button
                      onClick={handleSaveTranscript}
                      disabled={saving}
                      className="w-full rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Save Text"}
                    </button> */}
                    <button
                      onClick={() => navigate("/rewrite", { state: { inputText: transcript } })}
                      disabled={!transcript.trim()}
                      className="w-full rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Re-Write
                    </button>
                    <button
                      onClick={() => {
                        setTranscript("");
                        setToast({ open: true, message: "Cleared transcript", variant: "success" });
                      }}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-1 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="max-h-96 overflow-y-auto sidebar-scrollbar  rounded-lg border border-white/10 bg-[var(--secondary-color)] p-5">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--text-color)]">
                      {transcript}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {loading && !transcript && (
          <div className="flex min-h-64 items-center justify-center rounded-lg border border-white/10 bg-[var(--secondary-color)]  px-6 py-12 backdrop-blur-xl">
            <div className="text-center">
              <div className="mb-4 text-5xl animate-bounce">🤖</div>
              <p className="font-semibold text-slate-100">Processing your video...</p>
              <p className="mt-2 text-sm text-slate-400">This may take a moment.</p>
            </div>
          </div>
        )}

        <p className="pb-4 text-center text-xs text-slate-500">Your data is processed securely.</p>
      </main>
      <Success
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </div>
  );
}
