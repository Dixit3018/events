const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    role: { type: String },
    user_id: { type: String },
    event_id: { type: String },
    review: { type: Number, default: null },
    status: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("History", feedbackSchema);
module.exports = Feedback;
