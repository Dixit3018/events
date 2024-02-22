const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  organizer_id: { type: String, required: true },
  name: { type: String, required: true },
  venue: { type: String, required: true },
  description: { type: String, required: true },
  volunteers: { type: Number, required: true },
  pay_per_volunteer: { type: Number, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  days: { type: Number, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  cover_img: { type: String, required: true },
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
