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

const userSocketMap = {};

io.on("connection", async (socket) => {
  console.log("user connected with socket id: " + socket.id);

  socket.on("msg", async (obj) => {
    const { message, recipent_id, sender_id } = obj;

    const dataExists = await ChatData.findOne({
      recipent_id: recipent_id,
      sender_id: sender_id,
    });

    if (dataExists) {
      dataExists.messages = [...dataExists.messages, { message: message }];
      await dataExists.save();
    } else {
      const chatData = new ChatData({
        userId: recipent_id,
        socketId: socket.id,
        sender: sender_id,
        messages: [{ message: message }],
      });
      await chatData.save();
    }

    io.to(socket.id).emit("msg", { message: message, sender_id: sender_id });
    //io.to(recipientSocketId).emit("msg", { message: message, sender_id: sender_id });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected with socket id: " + socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
});
