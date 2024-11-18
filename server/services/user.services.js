const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinaryConfig = require("../config/cloudinary");
const fs = require("fs");
const { User, Category, Transaction } = require("../models/index");
require("dotenv").config();

const createUser = async ({ name, email, password, file }) => {
    console.log(name, email, password, file);
    if (!name || !email || !password) {
        throw new Error("Fill up all the fields");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let avatar = process.env.DEFAULT_AVATAR_URL;
    if (file) {
        const image = await cloudinaryConfig.uploader.upload(file.path, {
            folder: "finsavyy",
        });
        avatar = image.secure_url;
        fs.unlinkSync(file.path);
    }

    return await User.create({
        name,
        email,
        password: hashedPassword,
        avatar,
        walletBalance: 0.0,
    });
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error("User not found");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw new Error("Wrong Password");
    }

    const token = jwt.sign(
        {
            username: user.name,
            userId: user.userId,
            userEmail: user.email,
            avatar: user.avatar,
        },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
    );

    return { message: "Auth Successful", token };
};

const getUserById = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("User not found");
    }
    return user;
};

const updateUser = async (userId, { name, email }) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("User not found");
    }

    await user.update({ name });
    return user;
};

const deleteUser = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("User not found");
    }

    await user.destroy();
    return user;
};

const uploadAvatar = async (userId, file) => {
    if (!file) {
        throw new Error("No file provided");
    }

    const image = await cloudinaryConfig.uploader.upload(file.path, {
        folder: "finsavyy",
    });

    fs.unlinkSync(file.path);

    await User.update({ avatar: image.secure_url }, { where: { userId } });

    return await User.findByPk(userId);
};

const updatePassword = async (userId, newPassword) => {
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("User not found");
    }

    // Ensure password history exists
    const passwordHistory = user.passwordHistory || [];

    // Check if the new password matches any of the last 3 passwords
    const isPasswordInHistory = await Promise.any(
        passwordHistory.map((oldPasswordHash) =>
            bcrypt.compare(newPassword, oldPasswordHash)
        )
    ).catch(() => false); // `Promise.any` will throw an error if none resolve to true

    if (isPasswordInHistory) {
        throw new Error(
            "New password cannot be the same as any of the last 3 passwords"
        );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password history
    const updatedPasswordHistory = [...passwordHistory, user.password];

    // Keep only the last 3 passwords in the history
    if (updatedPasswordHistory.length > 3) {
        updatedPasswordHistory.shift();
    }

    // Update user record
    user.password = hashedPassword;
    user.passwordHistory = updatedPasswordHistory;
    await user.save();

    return { message: "Password updated successfully" };
};

const updateWalletBalance = async (userId, newBalance) => {
    if (newBalance === undefined || newBalance === null) {
        throw new Error("New balance is required");
    }

    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const currentBalance = user.walletBalance;

    if (currentBalance === newBalance) {
        throw new Error("New balance is the same as the current balance");
    }

    const isAddition = newBalance > currentBalance;
    const categoryName = isAddition ? "Direct Transfer" : "Direct Spending";
    const transactionType = isAddition ? "credit" : "debit";
    const amount = Math.abs(newBalance - currentBalance);

    // Check if the appropriate category exists
    let category = await Category.findOne({ where: { name: categoryName } });

    if (!category) {
        // Create category if it doesn't exist
        category = await Category.create({ name: categoryName, userId });
    }

    // Update the user's wallet balance
    user.walletBalance = newBalance;
    await user.save();

    // Record the transaction
    await Transaction.create({
        categoryId: category.id,
        amount,
        type: transactionType,
        userId: user.userId,
        createdAt: new Date(),
    });

    return {
        message: "Wallet balance updated successfully",
        walletBalance: user.walletBalance,
    };
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
