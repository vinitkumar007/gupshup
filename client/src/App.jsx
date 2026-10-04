import { useState } from "react";
import { socket } from "./socket.js";
import Join from "./Join.jsx";
import Room from "./Room.jsx";

export default function App() {
  const [session, setSession] = useState(null); // { name, room }

  function handleJoin(name, room, onError) {
    socket.emit("join", { name, room }, (res) => {
      if (res?.error) return onError(res.error);
      setSession({ name: res.name, room: res.room });
    });
  }

  function handleLeave() {
    socket.disconnect();
    socket.connect();
    setSession(null);
  }

  return session ? (
    <Room session={session} onLeave={handleLeave} />
  ) : (
    <Join onJoin={handleJoin} />
  );
}
