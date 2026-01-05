import { io } from "socket.io-client";
import { env } from "../env";

const SOCKET_URL = 
    import.meta.env.MODE === "production"
      ? "https://dsahub-backend.onrender.com"
      : "http://localhost:8000"

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
});