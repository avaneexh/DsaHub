import React from "react";
import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { usePlaylistStore } from "../store/usePlaylistStore";

const CreatePlaylist = ({ isOpen, onClose }) => {
  const { createPlaylist, isLoading } = usePlaylistStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    await createPlaylist({
      name: data.name,
      description: data.description,
    });

    reset();
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
            Create Playlist
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-5 py-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Playlist Name
            </label>
            <input
              type="text"
              placeholder="My DSA Playlist"
              {...register("name", { required: "Name is required" })}
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
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Short description (optional)"
              {...register("description")}
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
              type="submit"
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylist;
