const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user_id: { type: String },
    event_id: { type: String },
    role: { type: String },
    review: { type: String, default: null },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
module.exports = Feedback;
