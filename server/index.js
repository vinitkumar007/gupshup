import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { addUser, removeUser, getUser, usersInRoom } from "./users.js";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());

app.get("/", (req, res) => res.send("Gupshup server chal raha hai"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

function makeMessage(from, text) {
  return { from, text, time: Date.now() };
}

io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, ack) => {
    const { user, error } = addUser(socket.id, name || "", room || "");
    if (error) return ack?.({ error });

    socket.join(user.room);

    socket.emit("message", makeMessage("system", `${user.name}, ${user.room} me swagat hai!`));
    socket.to(user.room).emit("message", makeMessage("system", `${user.name} aa gaya`));
    io.to(user.room).emit("roomUsers", usersInRoom(user.room));

    ack?.({ ok: true, name: user.name, room: user.room });
  });

  socket.on("sendMessage", (text, ack) => {
    const user = getUser(socket.id);
    if (!user || !text || !text.trim()) return ack?.();

    io.to(user.room).emit("message", makeMessage(user.name, text.trim().slice(0, 1000)));
    socket.to(user.room).emit("typing", { name: user.name, typing: false });
    ack?.();
  });

  socket.on("typing", (isTyping) => {
    const user = getUser(socket.id);
    if (!user) return;
    socket.to(user.room).emit("typing", { name: user.name, typing: !!isTyping });
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (!user) return;
    io.to(user.room).emit("message", makeMessage("system", `${user.name} chala gaya`));
    io.to(user.room).emit("roomUsers", usersInRoom(user.room));
    io.to(user.room).emit("typing", { name: user.name, typing: false });
  });
});

server.listen(PORT, () => console.log(`Server port ${PORT} pe chal raha hai`));
