const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user_id: { type: String },
  tasks: [
    {
      name: { type: String },
      status: { type: String, default: "pending" },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
  ],
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
