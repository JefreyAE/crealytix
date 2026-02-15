"use client";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  const confirmStyles =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-indigo-600 hover:bg-indigo-700 text-white";

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-xl space-y-6"
      >
        <h3 className="text-xl font-semibold">{title}</h3>

        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
          {description}
        </p>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 py-3 font-medium hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            className={`flex-1 rounded-xl py-3 font-medium transition ${confirmStyles}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
