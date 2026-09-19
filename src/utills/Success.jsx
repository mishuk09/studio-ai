import { CheckCircle, X } from "lucide-react";
import { useEffect } from "react";

export default function Success({
  message = "Success",
  open = true,
  onClose,
  duration = 3000,
  className = "",
  variant = "success", // 'success' | 'error'
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  const bgClass = variant === "error" ? "bg-red-600/95" : "bg-green-600/95";
  const Icon = variant === "error" ? CheckCircle : CheckCircle;

  return (
    <div className={`fixed top-6 right-6 z-50 ${className}`}>
      <div
        className={`flex items-center gap-3 rounded-lg ${bgClass} px-4 py-3 text-white shadow-lg`}
      >
        <Icon size={20} />
        <div className="text-sm">{message}</div>
        <button
          onClick={() => onClose && onClose()}
          aria-label="Close"
          className="ml-3 inline-flex items-center justify-center rounded-md p-1 text-white/90 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
