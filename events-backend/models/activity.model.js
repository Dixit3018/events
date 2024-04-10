const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user_id: { type: String },
    timeSpent: { type: Number },
    date: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
