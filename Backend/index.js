const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const cors = require('cors'); // ✅ Add this
const authRouter = require("./Controller/authController");
const chatRouter = require("./Controller/chatController");
const messageRouter = require("./Controller/messageController");
dotenv.config();
const app = express();
// app.use(cors());

const onlineUser = [];
app.use(cors());
app.use(express.json({
  limit:"50mb"
}));
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log("Server is conncted to mongodb");
  } catch (error) {
    console.log("Server is not connected ", error);
  }
};
connectDb();
app.get("/", (req, res) => {
  res.send("Api is running");
});
app.use("/user", userRoutes);
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);

io.on("connection", (socket) => {
  socket.on("join-room", (userid) => {
    socket.join(userid);
  });

  socket.on("send-message", (message) => {
    io.to(message.members[0])
      .to(message.members[1])
      .emit("receive-message", message);

    io.to(message.members[0])
      .to(message.members[1])
      .emit("set-message-count", message);
  });

  socket.on("clear-unread-messages", (data) => {
    io.to(data.members[0])
      .to(data.members[1])
      .emit("message-count-cleared", data);
  });

  socket.on("user-typing", (data) => {
    io.to(data.members[0]).to(data.members[1]).emit("started-typing", data);
  });

  socket.on("user-login", (userId) => {
    if (!onlineUser.includes(userId)) {
      onlineUser.push(userId);
    }
    io.emit("online-users", onlineUser); // Broadcast to all clients
  });

  socket.on("user-offline", (userId) => {
    onlineUser.splice(onlineUser.indexOf(userId), 1);
    io.emit("online-users-updated", onlineUser); // Broadcast to all clients
  });

  // Handle client disconnect
  socket.on("disconnect", () => {
    // Find the userId associated with this socket (if stored)
    const userId = onlineUser.find((id) => id === socket.userId); // You may need to store userId on the socket
    if (userId) {
      onlineUser.splice(onlineUser.indexOf(userId), 1);
      io.emit("online-users-updated", onlineUser); // Broadcast to all clients
    }
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server started at port ${PORT}`));
