const express = require("express");
const taskController = require("../controllers/task.controller");
const checkLogin = require("../middleware/checkLogin");

const router = express.Router();

// Create a new task
router.post("/add", checkLogin, taskController.createTask);

// Get all tasks
router.get("/all", checkLogin, taskController.getAllTasks);

// Get a single task by ID
router.get("/:id", checkLogin, taskController.getTaskById);

// Update task details
router.put("/:id", checkLogin, taskController.updateTask);

// Update task status
router.patch("/:id/status", checkLogin, taskController.updateTaskStatus);

// Update task priority
router.patch("/:id/priority", checkLogin, taskController.updateTaskPriority);

// Delete a task
router.delete("/:id", checkLogin, taskController.deleteTask);

module.exports = router;
