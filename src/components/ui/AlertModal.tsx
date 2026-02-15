"use client";

type AlertModalProps = {
  open: boolean;
  title: string;
  message: string;
  buttonLabel?: string;
  variant?: "default" | "danger" | "warning";
  onClose: () => void;
};

export default function AlertModal({
  open,
  title,
  message,
  buttonLabel = "OK",
  variant = "default",
  onClose,
}: AlertModalProps) {
  if (!open) return null;

  const variantStyles = {
    default: "bg-indigo-600 hover:bg-indigo-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-8 shadow-xl space-y-6"
      >
        <h3 className="text-xl font-semibold">{title}</h3>

        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
          {message}
        </p>

        <button
          onClick={onClose}
          className={`w-full rounded-xl py-3 font-medium transition ${
            variantStyles[variant]
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
