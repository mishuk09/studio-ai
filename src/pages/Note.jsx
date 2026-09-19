import { CalendarDays, Edit2, NotebookPen, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Success from "../utills/Success";

export default function Note() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deletingNoteId, setDeletingNoteId] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ open: false, message: "", variant: "success" });

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

  const sortedNotes = useMemo(() => {
    return [...notes].sort((left, right) => {
      const leftTime = new Date(left?.created_at || 0).getTime();
      const rightTime = new Date(right?.created_at || 0).getTime();
      return rightTime - leftTime;
    });
  }, [notes]);

  const fetchNotes = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please sign in before viewing notes.");
      setNotes([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://pressai.info/api/user/notes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch notes.");
      }

      setNotes(Array.isArray(data?.notes) ? data.notes : []);
    } catch (fetchError) {
      console.error("Error fetching notes:", fetchError);
      setError(fetchError.message || "Something went wrong while fetching notes.");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const openModal = () => {
    setModalMode("add");
    setEditingNoteId(null);
    setTitle("");
    setDescription("");
    setModalOpen(true);
  };

  const openEditModal = (note) => {
    setModalMode("edit");
    setEditingNoteId(note?.noteId || note?._id || null);
    setTitle(note?.title || "");
    setDescription(note?.description || "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalMode("add");
    setEditingNoteId(null);
    setTitle("");
    setDescription("");
  };

  const handleSaveNote = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token) {
      setToast({ open: true, message: "Please sign in before saving notes.", variant: "error" });
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

    if (!title.trim() || !description.trim()) {
      setToast({ open: true, message: "Title and description are required.", variant: "error" });
      return;
    }

    setSaving(true);

    try {
      const isEdit = modalMode === "edit";
      const url = isEdit
        ? `https://pressai.info/api/user/notes/${editingNoteId}`
        : "https://pressai.info/api/user/notes";

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(
          isEdit
            ? {
                title,
                description,
              }
            : {
                title,
                description,
                email,
              }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({
          open: true,
          message: data?.error || (isEdit ? "Failed to update note." : "Failed to save note."),
          variant: "error",
        });
        return;
      }

      setToast({
        open: true,
        message: isEdit ? "Note updated successfully." : "Note saved successfully.",
        variant: "success",
      });
      closeModal();
      await fetchNotes();
    } catch (saveError) {
      console.error("Error saving note:", saveError);
      setToast({
        open: true,
        message:
          modalMode === "edit"
            ? "Network error: could not update the note."
            : "Network error: could not save the note.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (note) => {
    const noteId = note?.noteId || note?._id || null;

    if (!noteId) {
      setToast({ open: true, message: "Note ID was not found.", variant: "error" });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setToast({ open: true, message: "Please sign in before deleting notes.", variant: "error" });
      return;
    }

    const shouldDelete = window.confirm("Delete this note?");
    if (!shouldDelete) return;

    setDeletingNoteId(noteId);

    try {
      const response = await fetch(`https://pressai.info/api/user/notes/${noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setToast({
          open: true,
          message: data?.error || "Failed to delete note.",
          variant: "error",
        });
        return;
      }

      setNotes((current) =>
        current.filter((item) => String(item?.noteId || item?._id) !== String(noteId))
      );
      setToast({ open: true, message: "Note deleted successfully.", variant: "success" });
    } catch (deleteError) {
      console.error("Error deleting note:", deleteError);
      setToast({
        open: true,
        message: "Network error: could not delete the note.",
        variant: "error",
      });
    } finally {
      setDeletingNoteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-color)] px-4 py-10 text-white sm:px-6 lg:px-6">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <div className="text-center">
          <div className="mb-4 inline-flex rounded-full border border-[var(--border-color)] bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
            Your Note
          </div>
          <h1 className="text-4xl font-bold text-white md:text-5xl">Your Notes</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300 md:text-xl">
            Add quick notes, store them safely, and review everything below.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={openModal}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
          >
            <Plus size={16} />
            Add Note
          </button>

          <button
            type="button"
            onClick={fetchNotes}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 shadow-lg shadow-black/10">
            <p className="font-semibold">Error</p>
            <p className="text-sm text-red-100/90">{error}</p>
          </div>
        )}

        {loading && (
          <div className="rounded-lg border border-white/10 bg-[var(--secondary-color)] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 p-4 text-cyan-200">
              <NotebookPen size={28} />
            </div>
            <p className="text-lg font-semibold text-white">Loading notes...</p>
            <p className="mt-2 text-sm text-slate-400">Fetching notes from your account.</p>
          </div>
        )}

        {!loading && !error && sortedNotes.length === 0 && (
          <div className="rounded-lg border border-white/10 bg-[var(--secondary-color)] p-8 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="mb-4 inline-flex rounded-full border border-white/10 bg-white/5 p-4 text-cyan-200">
              <NotebookPen size={28} />
            </div>
            <p className="text-lg font-semibold text-white">No notes found</p>
            <p className="mt-2 text-sm text-slate-400">Click Add Note to create your first note.</p>
          </div>
        )}

        {sortedNotes.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
            {sortedNotes.map((note) => (
              <article
                key={note.noteId || note._id || note.title}
                className="rounded-lg border border-white/10 bg-[var(--secondary-color)] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl md:p-8"
              >
                <div className="mb-4 flex flex-col gap-3 border-b border-white/10 pb-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">{note.title}</h2>
                    {note.created_at && (
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <CalendarDays size={16} />
                        <span>{formatDate(note.created_at)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(note)}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                      aria-label="Edit note"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteNote(note)}
                      disabled={deletingNoteId === (note.noteId || note._id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label="Delete note"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--text-color)] text-justify">
                  {note.description}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[var(--secondary-color)] p-5 shadow-2xl shadow-black/40 md:p-8">
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {modalMode === "edit" ? "Edit Note" : "Add Note"}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {modalMode === "edit"
                    ? "Update the title and description."
                    : "Create a title and description note."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:bg-white/10 hover:text-white"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[var(--primary-color)] px-4 py-3 text-[var(--text-color)] outline-none placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Enter note title"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Description
                </label>
                <textarea
                  rows={7}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[var(--primary-color)] px-4 py-3 text-[var(--text-color)] outline-none placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Enter note description"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : modalMode === "edit" ? "Update Note" : "Save Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Success
        open={toast.open}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast((current) => ({ ...current, open: false }))}
      />
    </div>
  );
}
