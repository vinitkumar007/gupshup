// users.js - room ke andar kaun-kaun hai, uska hisaab yahan rakhte hain

const onlineUsers = new Map(); // socketId -> { name, room }

export function addUser(id, name, room) {
  name = name.trim();
  room = room.trim().toLowerCase();

  if (!name || !room) return { error: "Naam aur room dono chahiye" };

  // same room me same naam dobara nahi chalega
  for (const u of onlineUsers.values()) {
    if (u.room === room && u.name.toLowerCase() === name.toLowerCase()) {
      return { error: "Ye naam is room me pehle se hai" };
    }
  }

  const user = { name, room };
  onlineUsers.set(id, user);
  return { user };
}

export function removeUser(id) {
  const user = onlineUsers.get(id);
  onlineUsers.delete(id);
  return user;
}

export function getUser(id) {
  return onlineUsers.get(id);
}

export function usersInRoom(room) {
  const list = [];
  for (const u of onlineUsers.values()) {
    if (u.room === room) list.push(u.name);
  }
  return list;
}
