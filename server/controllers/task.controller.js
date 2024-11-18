const taskService = require("../services/task.services");

// Create a new task
const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask(req.body, req.user.userId);
        res.status(201).json({
            message: "Task created successfully",
            task,
        });
    } catch (err) {
        res.status(422).json({ error: err.message }); // Unprocessable Entity
    }
};

// Get all tasks
const getAllTasks = async (req, res) => {
    try {
        const { userId } = req.user; // Assuming `userId` is available in `req.user`
        const tasks = await taskService.getAllTasksByUserId(userId);
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Unable to fetch tasks" });
    }
};

// Get a task by ID
const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskService.getTaskById(id, req.user.userId);
        res.status(200).json(task);
    } catch (err) {
        res.status(404).json({ error: err.message }); // Not Found
    }
};

// Update task details
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await taskService.updateTask(
            id,
            req.body,
            req.user.userId
        );
        res.status(200).json({
            message: "Task updated successfully",
            task,
        });
    } catch (err) {
        res.status(404).json({ error: err.message }); // Not Found
    }
};

// Update task status
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isCompleted } = req.body;

        if (isCompleted === undefined) {
            return res.status(400).json({ error: "isCompleted is required" }); // Bad Request
        }

        const task = await taskService.updateTaskStatus(
            id,
            isCompleted,
            req.user.userId
        );
        res.status(200).json({
            message: "Task status updated successfully",
            task,
        });
    } catch (err) {
        res.status(404).json({ error: err.message }); // Not Found
    }
};

// Update task priority
const updateTaskPriority = async (req, res) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;

        if (!priority) {
            return res.status(400).json({ error: "Priority is required" }); // Bad Request
        }

        const task = await taskService.updateTaskPriority(
            id,
            priority,
            req.user.userId
        );
        res.status(200).json({
            message: "Task priority updated successfully",
            task,
        });
    } catch (err) {
        res.status(404).json({ error: err.message }); // Not Found
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await taskService.deleteTask(id, req.user.userId);
        res.status(200).json({ message: "Task Deleted successfully" }); // No content
    } catch (err) {
        res.status(404).json({ error: err.message }); // Not Found
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    updateTaskStatus,
    updateTaskPriority,
    deleteTask,
};
