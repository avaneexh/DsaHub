import React, { useEffect, useState } from "react";
import { ArrowLeft, Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { usePlaylistStore } from "../store/usePlaylistStore";
import AddToPlaylistModal from "../components/AddToPlaylistModal";
import EditPlaylistModal from "../components/EditPlaylistModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const {
    getPlaylistDetails,
    currentPlaylist,
    isLoading,
    removeProblemFromPlaylist,
    deletePlaylist,
  } = usePlaylistStore();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    getPlaylistDetails(playlistId);
  }, [playlistId]);

  if (isLoading || !currentPlaylist) {
    return <div className="p-6">Loading...</div>;
  }

//   console.log("currentPlaylist",currentPlaylist);
  

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
    <div className="flex items-center justify-between px-5 py-5 sm:px-8 sm:pt-7 sm:pb-4">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {currentPlaylist.name}
        </h1>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setOpenEdit(true)}>
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={() => setOpenDelete(true)}>
          <Trash2 className="w-4 h-4" />
        </button>
        <button onClick={() => setOpenAdd(true)}>
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* Table */}
    <div className="overflow-x-auto border-t border-neutral-300/70 dark:border-neutral-700/70">
      <table className="min-w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            <th className="px-5 py-3 sm:px-8">S.No</th>
            <th className="px-5 py-3 sm:px-8">Title</th>
            <th className="px-5 py-3 sm:px-8">Tags</th>
            <th className="px-5 py-3 sm:px-8">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentPlaylist.problems?.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="px-5 py-6 text-center text-sm text-neutral-500 sm:px-8"
              >
                No problems added yet
              </td>
            </tr>
          ) : (
            currentPlaylist.problems.map((problem, idx) => (
              <tr
                key={problem.id}
                className={`
                  ${idx % 2 === 0
                    ? "bg-neutral-100/60 dark:bg-neutral-900/60"
                    : "bg-neutral-50/60 dark:bg-neutral-950/40"}
                `}
              >
                <td className="px-5 py-3 sm:px-8">
                  {idx + 1}
                </td>

                <td className="px-5 py-3 sm:px-8 font-semibold">
                  {problem.problem.title}
                </td>

                <td className="px-5 py-3 sm:px-8">
                  <div className="flex flex-wrap gap-1.5">
                    {(problem.problem.tags || []).map((tag, i) => (
                      <span
                        key={i}
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
                  <button
                    onClick={() =>
                      removeProblemFromPlaylist(
                        playlistId,
                        [problem.problem.id]
                      )
                    }
                    className="
                      inline-flex items-center justify-center
                      rounded-full border border-red-600/80
                      px-2.5 py-1 text-[11px] font-medium
                      text-red-700 hover:bg-red-600 hover:text-white
                      transition-colors
                    "
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>

  {/* Modals */}
  <AddToPlaylistModal
    isOpen={openAdd}
    onClose={() => setOpenAdd(false)}
    playlistId={playlistId}
  />

  <EditPlaylistModal
    isOpen={openEdit}
    onClose={() => setOpenEdit(false)}
    playlist={currentPlaylist}
  />

  <ConfirmDeleteModal
    isOpen={openDelete}
    onClose={() => setOpenDelete(false)}
    onConfirm={async () => {
      await deletePlaylist(playlistId);
      navigate("/playlists");
    }}
    title="Delete Playlist?"
    description="This action cannot be undone."
  />
</section>

  );
};

export default PlaylistDetail;
