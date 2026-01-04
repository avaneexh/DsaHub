import { io } from "socket.io-client";
import { env } from "../env";

const SOCKET_URL =
  import.meta.env.MODE === "production"
    ? env.BASE_URL_PRODUCTION
    : env.BASE_URL_DEV;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});
