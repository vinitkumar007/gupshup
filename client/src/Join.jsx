import { useState } from "react";

export default function Join({ onJoin }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [err, setErr] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!name.trim() || !room.trim()) {
      setErr("Naam aur room dono bharo");
      return;
    }
    setErr("");
    onJoin(name, room, setErr);
  }

  return (
    <div className="join-page">
      <form className="join-card" onSubmit={submit}>
        <h1>Gupshup</h1>
        <p className="tagline">Dosto ke saath live baat karo</p>

        <label>
          Tumhara naam
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={20} placeholder=" vinit kumar" />
        </label>

        <label>
          Room ka naam
          <input value={room} onChange={(e) => setRoom(e.target.value)} maxLength={20} placeholder=" dosti" />
        </label>

        {err && <div className="error">{err}</div>}

        <button type="submit">Room me jao</button>
      </form>
    </div>
  );
}
