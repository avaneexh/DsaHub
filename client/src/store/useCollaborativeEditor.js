import { useEffect } from "react";
import { socket } from "../lib/socket";
import { useAuthStore } from "../store/useAuthStore";

export const useCollaborativeEditor = ({ roomId, setCode, setSelectedLanguage, }) => {
  const { authUser } = useAuthStore();

  useEffect(() => {
    console.log("🔥 useCollaborativeEditor hook loaded", { roomId, authUser });

    if (!roomId || !authUser) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-room", {
      roomId,
      userId: authUser.id,
    });

    socket.on("code-update", ({ code, language }) => {
      setCode(code);
      setSelectedLanguage(language);
    });

    socket.on("language-update", ({ language, code }) => {
      setSelectedLanguage(language);
      setCode(code);
    });


    return () => {
      socket.off("code-update");
    };
  }, [roomId, authUser, setCode]);
};
