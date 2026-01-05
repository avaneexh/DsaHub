import { Server } from "socket.io";

export const initCollabSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://dsahub.onrender.com",
      ],
      credentials: true,
    },
    transports: ["websocket"], 
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join-room", ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`${userId} joined ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });

    socket.on("code-change", ({ roomId, code, language }) => {
      socket.to(roomId).emit("code-update", { code, language });
    });

    socket.on("language-change", ({ roomId, language, code }) => {
      socket.to(roomId).emit("language-update", { language, code });
    });

  });
};
