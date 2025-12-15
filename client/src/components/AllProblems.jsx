import React, { useState, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Bookmark, PencilIcon, TrashIcon, Plus } from "lucide-react";
// import { useActions } from "../store/useAction";
// import AddToPlaylistModal from "./AddToPlaylist";
import CreatePlaylist from "../components/CreatePlaylist";
// import { usePlaylistStore } from "../store/usePlaylistStore";

const ProblemsTable = ({ problems }) => {
  const { authUser } = useAuthStore();
  // const { onDeleteProblem } = useActions();

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("ALL");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [openCreate, setOpenCreate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  // Extract all unique tags from problems
  const allTags = useMemo(() => {
    if (!Array.isArray(problems)) return [];
    const tagsSet = new Set();
    problems.forEach((p) => p.tags?.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [problems]);

  const difficulties = ["EASY", "MEDIUM", "HARD"];

  // Filter problems
  const filteredProblems = useMemo(() => {
    return (problems || [])
      .filter((problem) =>
        problem.title.toLowerCase().includes(search.toLowerCase())
      )
      .filter((problem) =>
        difficulty === "ALL" ? true : problem.difficulty === difficulty
      )
      .filter((problem) =>
        selectedTag === "ALL" ? true : problem.tags?.includes(selectedTag)
      );
  }, [problems, search, difficulty, selectedTag]);

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProblems.length / itemsPerPage)
  );
  const paginatedProblems = useMemo(() => {
    return filteredProblems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProblems, currentPage]);

  const handleDelete = (id) => {
    onDeleteProblem(id);
  };

 

  const handleAddToPlaylist = (problemId) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  const getDifficultyClass = (level) => {
    switch (level) {
      case "EASY":
        return "bg-neutral-100 text-neutral-800 border-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-500";
      case "MEDIUM":
        return "bg-neutral-200 text-neutral-900 border-neutral-500 dark:bg-neutral-700 dark:text-neutral-50 dark:border-neutral-400";
      case "HARD":
      default:
        return "bg-neutral-900 text-neutral-50 border-neutral-900 dark:bg-black dark:text-white";
    }
  };

  return (
    <section className="w-full px-4 mt-8">
      <div
        className="
          mx-auto max-w-6xl
          rounded-3xl border border-neutral-400/70
          bg-neutral-100/60 text-neutral-900
          shadow-sm backdrop-blur
          dark:bg-neutral-900/80 dark:text-neutral-50 dark:border-neutral-500/70
        "
      >
        {/* Header */}
        <div className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:pt-7 sm:pb-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Problems
            </h2>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
              Filter, track and save problems to playlists.
            </p>
          </div>
          <button
           onClick={() => setOpenCreate(true)}
            className="
              inline-flex items-center gap-2
              rounded-full border border-neutral-900/80
              px-4 py-1.5 text-xs font-medium tracking-tight
              shadow-sm transition-transform
              hover:-translate-y-0.5 hover:shadow-md
              dark:border-neutral-100
            "
            
          >
            <Plus className="w-4 h-4" />
            Create Playlist
          </button>
        </div>

        {/* Filters */}
        <div className="px-5 pb-4 sm:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Search by title"
              className="
                w-full md:w-1/3
                rounded-full border border-neutral-400/70
                bg-neutral-50 px-4 py-2 text-sm
                text-neutral-900 placeholder:text-neutral-400
                focus:outline-none focus:ring-2 focus:ring-neutral-800
                dark:bg-neutral-900 dark:text-neutral-50 dark:border-neutral-500
                dark:placeholder:text-neutral-500 dark:focus:ring-neutral-200
              "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex flex-wrap gap-3">
              <select
                className="
                  rounded-full border border-neutral-400/70
                  bg-neutral-50 px-3 py-2 text-xs
                  dark:bg-neutral-900 dark:text-neutral-50 dark:border-neutral-500
                "
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">All Difficulties</option>
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() +
                      diff.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              <select
                className="
                  rounded-full border border-neutral-400/70
                  bg-neutral-50 px-3 py-2 text-xs
                  dark:bg-neutral-900 dark:text-neutral-50 dark:border-neutral-500
                "
                value={selectedTag}
                onChange={(e) => {
                  setSelectedTag(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="ALL">All Tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border-t border-neutral-300/70 dark:border-neutral-700/70">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                <th className="px-5 py-3 sm:px-8">Solved</th>
                <th className="px-5 py-3 sm:px-8">Title</th>
                <th className="px-5 py-3 sm:px-8">Tags</th>
                <th className="px-5 py-3 sm:px-8">Difficulty</th>
                <th className="px-5 py-3 sm:px-8">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProblems.length > 0 ? (
                paginatedProblems?.map((problem, idx) => {
                  const isSolved = problem.solvedBy?.some(
                    (user) => user.userId === authUser?.id
                  );

                  return (
                    <tr
                      key={problem.id}
                      className={`
                        text-sm
                        ${idx % 2 === 0
                          ? "bg-neutral-100/60 dark:bg-neutral-900/60"
                          : "bg-neutral-50/60 dark:bg-neutral-950/40"}
                      `}
                    >
                      <td className="px-5 py-3 sm:px-8">
                        <input
                          type="checkbox"
                          checked={isSolved}
                          readOnly
                          className="
                            h-4 w-4 rounded border-neutral-400
                            text-neutral-900 focus:ring-neutral-900
                            dark:border-neutral-500 dark:bg-neutral-900
                            dark:text-neutral-50 dark:focus:ring-neutral-100
                          "
                        />
                      </td>
                      <td className="px-5 py-3 sm:px-8">
                        <Link
                          to={`/solve/${problem.id}`}
                          className="font-semibold hover:underline"
                        >
                          {problem.title}
                        </Link>
                      </td>
                      <td className="px-5 py-3 sm:px-8">
                        <div className="flex flex-wrap gap-1.5">
                          {(problem.tags || []).map((tag, idx) => (
                            <span
                              key={idx}
                              className="
                                rounded-full border border-neutral-400/80
                                px-2 py-0.5 text-[10px] font-medium
                                uppercase tracking-wide
                                dark:border-neutral-500
                              "
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3 sm:px-8">
                        <span
                          className={`
                            inline-flex items-center rounded-full
                            border px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wide
                            ${getDifficultyClass(problem.difficulty)}
                          `}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-5 py-3 sm:px-8">
                        <div className="flex flex-col items-start gap-2 md:flex-row md:items-center">
                          {authUser?.role === "ADMIN" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDelete(problem.id)}
                                className="
                                  inline-flex items-center justify-center
                                  rounded-full border border-red-600/80
                                  px-2.5 py-1 text-[11px] font-medium
                                  text-red-700 hover:bg-red-600 hover:text-white
                                  transition-colors
                                "
                              >
                                <TrashIcon className="w-3.5 h-3.5" />
                              </button>
                              <button
                                disabled
                                className="
                                  inline-flex items-center justify-center
                                  rounded-full border border-neutral-500/80
                                  px-2.5 py-1 text-[11px] font-medium
                                  text-neutral-700 opacity-60
                                "
                              >
                                <PencilIcon className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                          <button
                            className="
                              inline-flex items-center gap-1.5
                              rounded-full border border-neutral-900/80
                              px-3 py-1 text-[11px] font-medium
                              shadow-sm transition-transform
                              hover:-translate-y-0.5 hover:shadow-md
                              dark:border-neutral-100
                            "
                            onClick={() => handleAddToPlaylist(problem.id)}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">
                              Save to Playlist
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-sm text-neutral-500 sm:px-8"
                  >
                    No problems found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-3 px-5 py-5 sm:px-8">
          <button
            className="
              inline-flex items-center justify-center
              rounded-full border border-neutral-900/80
              px-3 py-1 text-xs font-medium
              disabled:opacity-40 disabled:cursor-not-allowed
              dark:border-neutral-100
            "
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>
          <span className="text-xs text-neutral-600 dark:text-neutral-300">
            {currentPage} / {totalPages}
          </span>
          <button
            className="
              inline-flex items-center justify-center
              rounded-full border border-neutral-900/80
              px-3 py-1 text-xs font-medium
              disabled:opacity-40 disabled:cursor-not-allowed
              dark:border-neutral-100
            "
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>

      <CreatePlaylist
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
      />
{/* 
      <AddToPlaylistModal
        isOpen={isAddToPlaylistModalOpen}
        onClose={() => setIsAddToPlaylistModalOpen(false)}
        problemId={selectedProblemId}
      />  */}
    </section>
  );
};

export default ProblemsTable;
