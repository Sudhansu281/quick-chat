const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
// const cors = require('cors'); // ✅ Add this
const authRouter = require("./Controller/authController");
const chatRouter = require("./Controller/chatController");
const messageRouter = require("./Controller/messageController");
dotenv.config();
const app = express();
// app.use(cors());

app.use(express.json());
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
    console.log("Server is not connected");
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
  socket.on('send-message',(message)=>{
    console.log(message);
    io
    .to(message.members[0])
    .to(message.members[1])
    .emit('receive-message',message);
  })
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server started at port ${PORT}`));
