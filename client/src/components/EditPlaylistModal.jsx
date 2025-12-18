import React, { useState } from "react";
import { usePlaylistStore } from "../store/usePlaylistStore";

const EditPlaylistModal = ({ isOpen, onClose, playlist }) => {
  const { updatePlaylist, isLoading } = usePlaylistStore();
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description || "");

  if (!isOpen) return null;

  const handleSave = async () => {
    await updatePlaylist(playlist.id, { name, description });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white dark:bg-black border border-black dark:border-white rounded-xl p-6 w-full max-w-md">
        <h2 className="font-semibold mb-4">Edit Playlist</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-black dark:border-white p-2 mb-3 bg-transparent"
          placeholder="Playlist name"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-black dark:border-white p-2 bg-transparent"
          placeholder="Description"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave} disabled={isLoading}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlaylistModal;
