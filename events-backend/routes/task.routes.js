const express = require("express");
const router = express.Router();

const taskController = require("../controllers/task.controller");

// get pending task
router.get("/get-task", taskController.getPendingTask);

// get completed task
router.get("/get-completed-task", taskController.getCompletedTask);

// update task list
router.put("/update-status", taskController.updateStatus);

// add task
router.post("/add-task", taskController.addTask);

module.exports = router;