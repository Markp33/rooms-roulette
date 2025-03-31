const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 3001;
let rooms = new Set();

app.use(express.static(__dirname));
app.use('/socket.io', express.static(__dirname + '/node_modules/socket.io/client-dist'));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('submit-username', (username) => console.log(`Username received: ${username}`));
  socket.on('get-room-list', () => socket.emit('update-room-list', Array.from(rooms)));

  socket.on('create-room', ({ username, roomName }) => {
    if (!rooms.has(roomName)) {
      rooms.add(roomName);
      console.log(`${username} created room: ${roomName}`);
      io.emit('update-room-list', Array.from(rooms));
    } else {
      console.log(`Room creation failed: ${roomName} exists.`);
    }
  });

  socket.on('join-room', ({ username, roomName }) => {
    if (rooms.has(roomName)) {
      socket.join(roomName);
      console.log(`${username} joined room: ${roomName}`);
    } else {
      console.log(`Join failed: ${roomName} does not exist.`);
    }
  });

  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
