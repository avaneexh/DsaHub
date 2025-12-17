import React, { useEffect } from 'react'
import { usePlaylistStore } from "../store/usePlaylistStore";
import { useParams } from 'react-router-dom';

const PlaylistDetail = () => {
  const playlistId = useParams()
  const { getPlaylistDetails, currentPlaylist, isLoading } = usePlaylistStore();

  useEffect(() => {
    getPlaylistDetails(playlistId);
  },[playlistId])

  console.log("currentPlaylist", currentPlaylist);
    

  return (
    <div>PlaylistDetail</div>
  )
}

export default PlaylistDetail