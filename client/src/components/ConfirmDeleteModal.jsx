import React, { useEffect } from "react";
import { X } from "lucide-react";

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete?",
  description = "Are you sure you want to delete this item?",
  loading = false,
}) => {
  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      role="dialog"
      aria-modal="true"
    >
      {/* Click outside to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative z-10 w-full max-w-sm
          rounded-xl border
          border-black bg-white text-black
          p-6 shadow-xl
          dark:border-white dark:bg-black dark:text-white
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="
              rounded-md p-1
              hover:bg-black hover:text-white
              dark:hover:bg-white dark:hover:text-black
            "
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm opacity-70 mb-6">
          {description}
        </p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
              rounded-lg border border-black
              px-4 py-2 text-sm
              hover:bg-black hover:text-white
              dark:border-white dark:hover:bg-white dark:hover:text-black
            "
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="
              rounded-lg border border-black
              bg-black px-4 py-2 text-sm font-medium
              text-white
              disabled:opacity-50
              dark:border-white dark:bg-white dark:text-black
            "
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
