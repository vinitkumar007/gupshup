import { useEffect, useRef, useState } from "react";
import { socket } from "./socket.js";

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Room({ session, onLeave }) {
  const { name, room } = session;
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typers, setTypers] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    const onMessage = (m) => setMessages((prev) => [...prev, m]);
    const onUsers = (list) => setUsers(list);
    const onTyping = ({ name: who, typing }) =>
      setTypers((prev) => {
        const rest = prev.filter((n) => n !== who);
        return typing ? [...rest, who] : rest;
      });

    socket.on("message", onMessage);
    socket.on("roomUsers", onUsers);
    socket.on("typing", onTyping);
    return () => {
      socket.off("message", onMessage);
      socket.off("roomUsers", onUsers);
      socket.off("typing", onTyping);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typers]);

  function onType(e) {
    setText(e.target.value);
    socket.emit("typing", true);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => socket.emit("typing", false), 1200);
  }

  function send(e) {
    e.preventDefault();
    if (!text.trim()) return;
    socket.emit("sendMessage", text);
    setText("");
    clearTimeout(typingTimer.current);
  }

  return (
    <div className="room">
      <aside className="sidebar">
        <h2>#{room}</h2>
        <p className="count">{users.length} online</p>
        <ul>
          {users.map((u) => (
            <li key={u}>
              <span className="dot" /> {u}
              {u === name && " (tum)"}
            </li>
          ))}
        </ul>
        <button className="leave" onClick={onLeave}>Room chhodo</button>
      </aside>

      <section className="chat">
        <div className="messages">
          {messages.map((m, i) =>
            m.from === "system" ? (
              <div key={i} className="sys">{m.text}</div>
            ) : (
              <div key={i} className={"msg " + (m.from === name ? "mine" : "theirs")}>
                {m.from !== name && <span className="who">{m.from}</span>}
                <p>{m.text}</p>
                <span className="time">{formatTime(m.time)}</span>
              </div>
            )
          )}
          <div className="typing">
            {typers.length > 0 && `${typers.join(", ")} likh raha hai...`}
          </div>
          <div ref={bottomRef} />
        </div>

        <form className="composer" onSubmit={send}>
          <input value={text} onChange={onType} placeholder="Message likho..." autoFocus />
          <button type="submit">Bhejo</button>
        </form>
      </section>
    </div>
  );
}
