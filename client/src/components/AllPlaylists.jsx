import React, { useEffect, useState, useMemo } from "react";
import { Pencil, Trash2, Plus, Search, ArrowLeft } from "lucide-react";
import { usePlaylistStore } from "../store/usePlaylistStore";
import CreatePlaylist from "./CreatePlaylist";
import { useNavigate } from "react-router-dom";
import AddToPlaylistModal from "./AddToPlaylistModal";

const AllPlaylists = () => {
  const navigate = useNavigate();
  const { getAllPlaylists, playlists, isLoading } = usePlaylistStore();
  const [openAdd, setOpenAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    getAllPlaylists();
  }, []);

  
  const filteredPlaylists = useMemo(() => {
    if (!playlists) return [];

    return playlists.filter((p) =>
      p?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [playlists, search]);

  // console.log("filteredPlaylists",filteredPlaylists);
  

  return (
    <section className="w-full px-4 mt-8 mb-12">
      {/* Card */}
      <div
        className="
          mx-auto max-w-6xl min-h-80
          rounded-3xl border border-neutral-400/70
          bg-neutral-100/60 text-neutral-900
          shadow-sm backdrop-blur
          dark:bg-neutral-900/80 dark:text-neutral-50 dark:border-neutral-500/70
        "
      >
        {/* ===== Top Bar ===== */}
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          {/* LEFT SIDE */}
          <div className="flex flex-col gap-4">
            {/* Title Row */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                All Playlists
              </h1>
            </div>

            {/* Search (below title) */}
            <div className="relative w-xl sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search playlist"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full rounded-xl border
                  border-neutral-300 dark:border-neutral-700
                  bg-transparent
                  pl-9 pr-4 py-2 text-sm
                  text-neutral-900 dark:text-neutral-100
                  placeholder:text-neutral-400
                  focus:outline-none focus:ring-1
                  focus:ring-neutral-900 dark:focus:ring-neutral-100
                "
              />
            </div>
          </div>

          {/* RIGHT SIDE (Create button centered) */}
          <div className="flex sm:self-center">
            <button
              onClick={() => setOpenCreate(true)}
              className="
                inline-flex items-center gap-2
                rounded-xl border border-neutral-900 dark:border-neutral-100
                px-4 py-2 text-sm font-medium
                text-neutral-900 dark:text-neutral-100
                hover:bg-neutral-900 hover:text-white
                dark:hover:bg-neutral-100 dark:hover:text-black
                transition
              "
            >
              <Plus className="h-4 w-4" />
              Create Playlist
            </button>
          </div>
        </div>


        {/* ===== Table ===== */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400">
              <th className="px-6 py-4 text-left w-16 font-medium">S.No</th>
              <th className="px-6 py-4 text-left font-medium">Title</th>
              <th className="px-6 py-4 text-left font-medium">Description</th>
              <th className="px-6 py-4 text-right font-medium w-40">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-neutral-500">
                  Loading playlists...
                </td>
              </tr>
            )}

            {playlists?.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-14 text-center text-neutral-500">
                  No playlist found.{" "}
                  <button
                    onClick={() => setOpenCreate(true)}
                    className="underline hover:text-black dark:hover:text-white"
                  >
                    Create?
                  </button>
                </td>
              </tr>
            )}

            {filteredPlaylists?.map((playlist, index) => (
              <tr
                key={playlist.id}
                className="
                  border-b border-neutral-100 dark:border-neutral-900
                  hover:bg-neutral-50 dark:hover:bg-neutral-900/40
                  transition
                "
              >
                <td className="px-6 py-4 text-neutral-500">
                  {index + 1}
                </td>

                <td className="px-6 py-4 font-medium">
                  {playlist?.name}
                </td>

                <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                  {playlist?.description || "—"}
                </td> 

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-full border border-neutral-300 dark:border-neutral-700 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button className="rounded-full border border-neutral-300 dark:border-neutral-700 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <button 
                      onClick={() => {
                        setPlaylist(playlist); 
                        setOpenAdd(true);
                      }}
                      className="rounded-full border border-neutral-300 dark:border-neutral-700 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                        <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreatePlaylist
        isOpen={openCreate}
        onClose={() => setOpenCreate(false)}
      />
      <AddToPlaylistModal
        isOpen={openAdd}
        onClose={() => {
          setOpenAdd(false);
          setPlaylist(null);
        }}
        playlistId={playlist?.id}
      />
    </section>
  );
};

export default AllPlaylists;
