const { Task } = require("../models/index");

// Create a new task
const createTask = async (taskData, userId) => {
    const { name, description, priority } = taskData;

    if (!name || !priority) {
        throw new Error("Task name and priority are required");
    }

    return await Task.create({
        name,
        description,
        priority,
        userId,
    });
};

// Get all tasks
const getAllTasksByUserId = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    return await Task.findAll({
        where: { userId },
    });
};

// Get a task by ID
const getTaskById = async (id, userId) => {
    const task = await Task.findOne({
        where: {
            id,
            userId,
        },
    });

    if (!task) {
        throw new Error(
            "Task not found or you are not authorized to access it"
        );
    }

    return task;
};

// Update task details (except status and priority)
const updateTask = async (id, taskData, userId) => {
    const task = await Task.findOne({
        where: {
            id,
            userId,
        },
    });
    if (!task) {
        throw new Error("Task not found");
    }

    const { name, description } = taskData;
    return await task.update({ name, description });
};

// Update task status
const updateTaskStatus = async (id, isCompleted, userId) => {
    const task = await Task.findOne({
        where: {
            id,
            userId,
        },
    });
    if (!task) {
        throw new Error("Task not found");
    }

    return await task.update({ isCompleted });
};

// Update task priority
const updateTaskPriority = async (id, priority, userId) => {
    const task = await Task.findOne({
        where: {
            id,
            userId,
        },
    });
    if (!task) {
        throw new Error("Task not found");
    }

    if (!["low", "medium", "high"].includes(priority)) {
        throw new Error("Invalid priority value");
    }

    return await task.update({ priority });
};

// Delete a task
const deleteTask = async (id, userId) => {
    const task = await Task.findOne({
        where: {
            id,
            userId,
        },
    });
    if (!task) {
        throw new Error("Task not found");
    }

    await task.destroy();
    return task;
};

module.exports = {
    createTask,
    getAllTasksByUserId,
    getTaskById,
    updateTask,
    updateTaskStatus,
    updateTaskPriority,
    deleteTask,
};
