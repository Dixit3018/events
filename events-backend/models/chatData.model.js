const mongoose = require("mongoose");

const ChatDataSchema = new mongoose.Schema(
  {
    participants: [String],
    messages: [
      {
        sender: String,
        recipient: String,
        message: String,
        isRead: { type: Boolean, default: false },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ChatDataSchema.index({ participants: 1 });

const ChatData = mongoose.model("ChatData", ChatDataSchema);
module.exports = ChatData;
