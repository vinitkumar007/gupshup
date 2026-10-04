# Gupshup - Realtime Chat App

React + Vite (client) aur Node + Express + Socket.io (server).
Naam aur room daalke join karo, room ke logo se live chat karo.

## Features
- Room based chat (alag room = alag baatein)
- Online users ki list
- "xyz likh raha hai..." typing indicator
- Message ke saath time
- Same room me same naam dobara allowed nahi
- Mobile pe bhi chalta hai

## Chalane ka tarika

Do terminal kholo.

Terminal 1 (server):
```
cd server
npm install
npm start
```

Terminal 2 (client):
```
cd client
npm install
npm run dev
```

Browser me http://localhost:3000 kholo. Do tabs kholke alag naam se same room me jao aur test karo.

## Deploy
- Server: Render / Railway pe `server` folder deploy karo (start command: `npm start`).
- Client: Netlify / Vercel pe `client` folder deploy karo. Env variable do:
  `VITE_SERVER_URL=https://tumhara-server-url`

## Folder structure
```
server/
  index.js    socket events (join, sendMessage, typing, disconnect)
  users.js    room aur users ka hisaab
client/src/
  App.jsx     join ya room screen decide karta hai
  Join.jsx    naam + room form
  Room.jsx    chat screen
  socket.js   socket connection
  styles.css  poora design
```
