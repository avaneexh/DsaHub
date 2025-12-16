import React, { useEffect, useMemo, useState } from "react";
import { X, Plus, Search } from "lucide-react";
import { useProblemStore } from "../store/useProblemStore";
import { usePlaylistStore } from "../store/usePlaylistStore";

const AddToPlaylistModal = ({ isOpen, onClose, playlistId }) => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();
  const { addProblemToPlaylist, isLoading } = usePlaylistStore();

  const [search, setSearch] = useState("");
  const [selectedProblems, setSelectedProblems] = useState([]);

  useEffect(() => {
    if (isOpen) {
      getAllProblems();
      setSelectedProblems([]);
      setSearch("");
    }
  }, [isOpen]);

  const filteredProblems = useMemo(() => {
    if (!problems) return [];
    return problems.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [problems, search]);

  const toggleProblem = (id) => {
    setSelectedProblems((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : [...prev, id]
    );
  };

  const handleAdd = async () => {
    if (selectedProblems.length === 0) return;
    await addProblemToPlaylist(playlistId, selectedProblems);
    onClose();
  };

  if (!isOpen) return null;

 return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      {/* Modal */}
      <div
        className="
          w-full max-w-2xl
          rounded-2xl border
          border-black bg-white text-black
          shadow-xl
          dark:border-white dark:bg-black dark:text-white
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-sm font-semibold">
            Add problems to Playlist
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pt-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
            <input
              type="text"
              placeholder="Search problem"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full rounded-lg border
                border-black bg-transparent
                pl-9 pr-4 py-2 text-sm
                placeholder:opacity-60
                focus:outline-none
                dark:border-white
              "
            />
          </div>
        </div>

        {/* Problems List */}
        <div className="px-6 py-4">
          <div className="max-h-64 overflow-y-auto rounded-xl ">
            {isProblemsLoading && (
              <div className="py-10 text-center text-sm opacity-70">
                Loading problems...
              </div>
            )}

            {!isProblemsLoading && filteredProblems.length === 0 && (
              <div className="py-10 text-center text-sm opacity-70">
                No problems found
              </div>
            )}

            {filteredProblems.map((problem) => {
              const selected = selectedProblems.includes(problem.id);

              return (
                <div
                  key={problem.id}
                  className="
                    flex items-center justify-between
                    px-4 py-3
                  "
                >
                  <span className="text-sm font-medium">
                    {problem.title}
                  </span>

                  <button
                    onClick={() => toggleProblem(problem.id)}
                    className={`
                      inline-flex items-center gap-1.5
                      rounded-md border px-3 py-1 text-xs
                      ${
                        selected
                          ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                          : "border-black dark:border-white"
                      }
                    `}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {selected ? "Added" : "Add"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4">
          <button
            onClick={onClose}
            className="
              rounded-lg border border-black
              px-4 py-2 text-sm
              hover:bg-black hover:text-white
              dark:border-white dark:hover:bg-white dark:hover:text-black
            "
          >
            Cancel
          </button>

          <button
            onClick={handleAdd}
            disabled={selectedProblems.length === 0 || isLoading}
            className="
              rounded-lg border border-black
              bg-black px-4 py-2 text-sm font-medium
              text-white
              disabled:opacity-50
              dark:border-white dark:bg-white dark:text-black
            "
          >
            Add to playlist
          </button>
        </div>
      </div>
    </div>
  );

};

export default AddToPlaylistModal;
