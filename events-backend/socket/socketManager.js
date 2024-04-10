const socketIO = require("socket.io");
const ChatData = require("../models/chatData.model");

module.exports = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", async (socket) => {
    socket.on("msg", async (obj) => {
      const { message, recipent_id, sender_id } = obj;

      if (!sender_id || !recipent_id) {
        console.error("Invalid sender_id or recipent_id");
        return;
      }

      const participants = [sender_id, recipent_id];
      participants.sort();

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
  });
};
