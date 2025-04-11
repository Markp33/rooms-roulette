const http = require("http");
const express = require("express");
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket(server);

io.on("connection", (socket) => {
  console.log("New user connected to room system:", socket.id);

  
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);
    io.to(roomId).emit("userJoined", socket.id);
  });

  socket.on("sendMessage", ({ roomId, message }) => {
    io.to(roomId).emit("message", { user: socket.id, message });
  });
});

server.listen(3000, () => {
  console.log("Room server running on port 3000");
});
