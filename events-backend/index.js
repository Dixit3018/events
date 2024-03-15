const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");
const routes = require("./routes/routes");
const cors = require("cors");
const path = require("path");

const ChatData = require("./models/chatData");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 4000;

app.use(cors());
mongoose.connect(`mongodb://localhost:27017/events`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

mongoose.connection.once("open", () => {
  console.log("connected to mongodb");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use("/api", routes);

io.on("connection", async (socket) => {
  socket.on("msg", async (obj) => {
    const { message, recipent_id, sender_id } = obj;

    if (!sender_id || !recipent_id) {
      console.error("Invalid sender_id or recipent_id");
      return; // Handle the case where sender_id or recipent_id is null or undefined
    }

    const participants = [sender_id, recipent_id];
    participants.sort(); // Sort the IDs to ensure consistent order

    const chat = await ChatData.findOne({
      participants: { $all: participants },
    });

    if (chat) {
      chat.messages.push({
        sender: sender_id,
        recipient: recipent_id,
        message: message,
      });
      await chat.save();
    } else {
      const newChat = new ChatData({
        participants: participants,
        messages: [
          { sender: sender_id, recipient: recipent_id, message: message },
        ],
      });
      await newChat.save();
    }
    io.to(socket.id).emit("msg", { message: message, sender_id: sender_id });
    if (recipent_id === sender_id) {
      return;
    }
    io.emit(recipent_id, { message: message, sender_id: sender_id });
  });

  socket.on("markRead", async (obj) => {
    const chatHistory = await ChatData.findOne({
      participants: { $all: [obj.senderId, obj.recipientId] },
    });

    if (!chatHistory) return;
    for (const msgData of chatHistory.messages) {
      if (msgData.sender === obj.recipientId && msgData.isRead === false) {
        msgData.isRead = true;
        await chatHistory.save();
        io.emit(msgData.sender + "read");
      }
    }
  });

  socket.on("disconnect", () => {
    // console.log("user disconnected with socket id: " + socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});
