import { io } from "socket.io-client";

// production me VITE_SERVER_URL env se aayega
const URL = import.meta.env.VITE_SERVER_URL || ( import.mita.env.prod ?"https://ghupshup.onrender.com" : "http://localhost:5000");

export const socket = io(URL);
