import { Server } from "socket.io";
import { createServer } from "http";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("⚡ New Connection:", socket.id);

  // join chat room
  socket.on("join_chat", (chatId: string) => {
    socket.join(chatId);
    console.log("User joined room:", chatId);
  });

  // send message
  socket.on("send_message", (data) => {
    socket.to(data.chatId).emit("receive_message", data);
    console.log("Message relayed in room", data.chatId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(3001, () => {
  console.log("🚀 Socket server running on http://localhost:3001");
});