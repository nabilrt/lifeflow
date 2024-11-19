const userService = require("../services/user.services");

const createUser = async (req, res) => {
    try {
        const user = await userService.createUser({
            ...req.body,
            file: req.file,
        });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const response = await userService.loginUser(req.body);
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.userId);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await userService.updateUser(req.user.userId, req.body);
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(req.user.userId);
        res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const uploadAvatar = async (req, res) => {
    try {
        const updatedUser = await userService.uploadAvatar(
            req.user.userId,
            req.file
        );
        res.status(200).json({
            message: "Avatar updated successfully",
            user: updatedUser,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        const response = await userService.updatePassword(
            req.user.userId,
            req.body.newPassword
        );
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateWalletBalance = async (req, res) => {
    try {
        const { newBalance } = req.body;
        if (newBalance === undefined || newBalance === null) {
            throw new Error("New balance is required");
        }

        const response = await userService.updateWalletBalance(
            req.user.userId,
            newBalance
        );
        res.status(200).json(response);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    createUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser,
    uploadAvatar,
    updatePassword,
    updateWalletBalance,
};
