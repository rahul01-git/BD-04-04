const { io } = require("socket.io-client");

const socket = io("https://todo-app-apma.onrender.com");

socket.on("connect", () => {
  console.log("Connected to WebSocket server with id:", socket.id);

  const userId = 1;
  socket.emit("identify", userId);
});

socket.on("notification", (data) => {
  console.log("Notification received:", data);
});

socket.on("disconnect", () => {
  console.log("Disconnected from WebSocket server");
});
