const { Transaction, Category, User } = require("../models/index");

const createTransaction = async (transactionData, userId) => {
    const { amount, category, type } = transactionData;

    if (!amount || !category || !type) {
        throw new Error("Missing required fields for transaction creation");
    }

    // Determine categoryId (if string, find or create; if ID, validate it's user-specific)
    let categoryId;
    if (typeof category === "string") {
        const existingCategory = await Category.findOne({
            where: { name: category, userId },
        });

        if (existingCategory) {
            categoryId = existingCategory.id;
        } else {
            const newCategory = await Category.create({
                name: category,
                userId,
            });
            categoryId = newCategory.id;
        }
    } else if (typeof category === "number") {
        const categoryExists = await Category.findOne({
            where: { id: category, userId },
        });
        if (!categoryExists) {
            throw new Error("Category not found for the user");
        }
        categoryId = category;
    } else {
        throw new Error("Invalid category format");
    }

    const transaction = await Transaction.create({
        userId,
        categoryId,
        amount,
        type,
        createdAt: new Date(),
    });

    // Update wallet balance
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const updatedBalance =
        type === "credit"
            ? user.walletBalance + amount
            : user.walletBalance - amount;

    await user.update({ walletBalance: updatedBalance });

    return transaction;
};
const getTransactionById = async (id, userId) => {
    const tour = await Transaction.findOne({ where: { id, userId } });
    if (!tour) {
        throw new Error("Transaction not found");
    }
    return tour;
};
const getTransactionsByUserId = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    return await Transaction.findAll({
        where: { userId },
        include: [
            {
                model: Category,
                attributes: ["name"],
                where: { userId }, // Scope categories by userId
            },
        ],
    });
};
const updateTransaction = async (id, transactionData, userId) => {
    const transaction = await Transaction.findOne({ where: { id, userId } });

    if (!transaction) {
        throw new Error("Transaction not found");
    }

    const { amount, category, type } = transactionData;

    let categoryId;
    if (typeof category === "string") {
        const existingCategory = await Category.findOne({
            where: { name: category, userId },
        });

        if (existingCategory) {
            categoryId = existingCategory.id;
        } else {
            const newCategory = await Category.create({
                name: category,
                userId,
            });
            categoryId = newCategory.id;
        }
    } else if (typeof category === "number") {
        const categoryExists = await Category.findOne({
            where: { id: category, userId },
        });
        if (!categoryExists) {
            throw new Error("Category not found for the user");
        }
        categoryId = category;
    }

    // Adjust wallet balance for the previous transaction
    const user = await User.findByPk(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const previousAmount = transaction.amount;
    const previousType = transaction.type;

    if (previousType === "credit") {
        user.walletBalance -= previousAmount;
    } else if (previousType === "debit") {
        user.walletBalance += previousAmount;
    }

    // Update the transaction
    await transaction.update({
        amount,
        categoryId,
        type,
    });

    // Adjust wallet balance for the new transaction
    const updatedBalance =
        type === "credit"
            ? user.walletBalance + amount
            : user.walletBalance - amount;

    await user.update({ walletBalance: updatedBalance });

    return transaction;
};
const adjustUserBalance = async (transaction, userId) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new Error("User not found");
    }

    // Revert the transaction
    const newBalance =
        transaction.type === "debit"
            ? user.walletBalance + transaction.amount
            : user.walletBalance - transaction.amount;

    // Ensure there's a category named "Revert Transaction"
    let revertCategory = await Category.findOne({
        where: {
            name: "Revert Transaction",
            userId,
        },
    });

    if (!revertCategory) {
        revertCategory = await Category.create({
            name: "Revert Transaction",
            userId,
        });
    }

    // Create a new transaction to log the reversal
    await Transaction.create({
        categoryId: revertCategory.id,
        amount: transaction.amount,
        type: transaction.type === "debit" ? "credit" : "debit",
        userId,
    });

    // Update the user's wallet balance
    user.walletBalance = newBalance;
    await user.save();
};
const deleteTransaction = async (id, userId) => {
    const transaction = await Transaction.findOne({
        where: {
            id,
            userId,
        },
    });

    if (!transaction) {
        throw new Error("Transaction not found");
    }

    await transaction.destroy();
    return transaction;
};

const getUserAnalytics = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const [result] = await Transaction.sequelize.query(
        `
        SELECT
            SUM(CASE WHEN type = 'credit' THEN amount ELSE 0 END) AS total_income,
            SUM(CASE WHEN type = 'debit' THEN amount ELSE 0 END) AS total_expense
        FROM transactions
        WHERE userId = :userId
    `,
        { replacements: { userId } }
    );

    return result;
};

module.exports = {
    createTransaction,
    getTransactionsByUserId,
    updateTransaction,
    deleteTransaction,
    getUserAnalytics,
    getTransactionById,
    adjustUserBalance,
};
