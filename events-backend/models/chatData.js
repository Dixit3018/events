const mongoose = require("mongoose");

const ChatDataSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    socketId: { type: String },
    sender: { type: String },
    messages: [
      {
        message: String,
        isRead: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ChatData = mongoose.model("ChatData", ChatDataSchema);
module.exports = ChatData;
