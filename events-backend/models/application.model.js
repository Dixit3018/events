const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    event_id: { type: String, required: true },
    organizer_id: { type: String, required: true },
    volunteer_id: { type: String, required: true },
    status: { type: String, default: "applied" },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
