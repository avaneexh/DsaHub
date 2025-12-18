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

  return (
    <section className="px-6 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>
          <h1 className="text-lg font-semibold">
            {currentPlaylist.name}
          </h1>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setOpenEdit(true)}>
            <Pencil />
          </button>
          <button onClick={() => setOpenDelete(true)}>
            <Trash2 />
          </button>
          <button onClick={() => setOpenAdd(true)}>
            <Plus />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-black dark:border-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-black dark:border-white">
            <tr>
              <th className="px-4 py-3 text-left w-16">S.No</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Tags</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentPlaylist.problems?.length === 0 && (
              <tr>
                <td colSpan="5" className="py-10 text-center opacity-70">
                  No problems added yet
                </td>
              </tr>
            )}

            {currentPlaylist.problems?.map((problem, index) => (
              <tr
                key={problem.id}
                className="border-b border-black dark:border-white"
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 font-medium">
                  {problem.title}
                </td>
                <td className="px-4 py-3">
                  {problem.description || "—"}
                </td>
                <td className="px-4 py-3">
                  {problem.tags?.join(", ") || "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() =>
                      removeProblemFromPlaylist(
                        playlistId,
                        [problem.id]
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
