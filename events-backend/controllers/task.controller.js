const Task = require("../models/tasks");
const { getUserIdFromToken } = require("../utils/utils");

//Get task
const getTask = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const tasks = await Task.findOne({ user_id: userId });
    if (tasks !== null && tasks !== "") {
      return res.status(200).json({ message: "success", tasks: tasks.tasks });
    } else {
      return res.status(200).json({ message: "no tasks", tasks: {} });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

// Update Task status
const updateStatus = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { taskId } = req.body;

    const taskList = await Task.findOne({ user_id: userId });

    if (taskList) {
      taskList.tasks.forEach(async (task) => {
        if (task._id == taskId) {
          task.status = "completed";
        }
      });
    }
    taskList.save();

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

// Add Task
const addTask = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    const { task } = req.body;

    if (task === "" || task === null || task === undefined) {
      return res.status(400).json({ message: "Invalid Data" });
    }
    const exist = await Task.findOne({ user_id: userId });
    let savedTask;

    if (exist) {
      exist.tasks.push({ name: task });
      savedTask = await exist.save();
    } else {
      savedTask = await Task.create({
        user_id: userId,
        tasks: [{ name: task }],
      });
    }
    const response = savedTask.tasks.pop();
    return res.status(200).json({ message: "success", task: response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "fail", error: error });
  }
};

module.exports = { getTask, updateStatus, addTask };
