import { io } from "socket.io-client";

// production me VITE_SERVER_URL env se aayega
const URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export const socket = io(URL, { autoConnect: true });
