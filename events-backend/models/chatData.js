const mongoose = require("mongoose");

const ChatDataSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    socketId: { type: String },
    messages: [{ sender: String, message: String, isRead: Boolean }],
  },
  {
    timestamps: true,
  }
);

const ChatData = mongoose.model("ChatData", ChatDataSchema);
module.exports = ChatData;
