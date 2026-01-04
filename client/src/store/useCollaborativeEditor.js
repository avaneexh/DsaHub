import { useEffect } from "react";
import { socket } from "../lib/socket";
import { useAuthStore } from "../store/useAuthStore";

export const useCollaborativeEditor = ({ roomId, setCode }) => {
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (!roomId || !authUser) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-room", {
      roomId,
      userId: authUser._id || authUser.id,
    });

    socket.on("code-update", (newCode) => {
      setCode(newCode);
    });

    return () => {
      socket.off("code-update");
    };
  }, [roomId, authUser, setCode]);
};
