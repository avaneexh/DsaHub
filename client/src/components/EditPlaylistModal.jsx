import React, { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { usePlaylistStore } from "../store/usePlaylistStore";

const EditPlaylistModal = ({ isOpen, onClose, playlist }) => {
  const { updatePlaylist, isLoading,  getPlaylistDetails, } = usePlaylistStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // keep state in sync when modal opens
  useEffect(() => {
    if (playlist) {
      setName(playlist.name || "");
      setDescription(playlist.description || "");
    }
  }, [playlist, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    await updatePlaylist(playlist.id, { name, description });
    await getPlaylistDetails(playlist.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Modal */}
      <div
        className="
          w-full max-w-md rounded-2xl
          border border-neutral-300 dark:border-neutral-700
          bg-white dark:bg-black
          shadow-xl
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Edit Playlist
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Playlist Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My DSA Playlist"
              className="
                w-full rounded-lg border
                border-neutral-300 dark:border-neutral-700
                bg-transparent
                px-3 py-2 text-sm
                text-neutral-900 dark:text-neutral-100
                placeholder:text-neutral-400
                focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100
              "
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description (optional)"
              className="
                w-full rounded-lg border
                border-neutral-300 dark:border-neutral-700
                bg-transparent
                px-3 py-2 text-sm
                text-neutral-900 dark:text-neutral-100
                placeholder:text-neutral-400
                focus:outline-none focus:ring-1 focus:ring-neutral-900 dark:focus:ring-neutral-100
              "
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                rounded-lg border border-neutral-300 dark:border-neutral-700
                px-4 py-2 text-xs font-medium
                text-neutral-700 dark:text-neutral-300
                hover:bg-neutral-100 dark:hover:bg-neutral-900
              "
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              disabled={isLoading}
              className="
                inline-flex items-center gap-2
                rounded-lg border border-neutral-900 dark:border-neutral-100
                bg-neutral-900 dark:bg-neutral-100
                px-4 py-2 text-xs font-medium
                text-white dark:text-black
                hover:opacity-90
                disabled:opacity-60
              "
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPlaylistModal;
