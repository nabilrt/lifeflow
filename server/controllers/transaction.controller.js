const transactionService = require("../services/transaction.services");

// Create a new transaction
const createTransaction = async (req, res) => {
    try {
        const transaction = await transactionService.createTransaction(
            req.body,
            req.user.userId
        );
        res.status(201).json({
            message: "Transaction created successfully",
            transaction,
        });
    } catch (err) {
        res.status(422).json({ error: err.message }); // Unprocessable Entity for validation errors
    }
};

const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transactions = await transactionService.getTransactionById(
            id,
            req.user.userId
        );
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message }); // Server error for unexpected failures
    }
};
// Get transactions by user ID
const getTransactionsByUserId = async (req, res) => {
    try {
        const { userId } = req.user;
        const transactions = await transactionService.getTransactionsByUserId(
            userId
        );
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: "Unable to fetch transactions" }); // Server error for unexpected failures
    }
};

// Update a transaction
const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res
                .status(400)
                .json({ error: "Transaction ID is required" });
        }
        const transaction = await transactionService.updateTransaction(
            id,
            req.body,
            req.user.userId
        );
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.status(200).json({
            message: "Transaction updated successfully",
            transaction,
        });
    } catch (err) {
        res.status(422).json({ error: err.message }); // Unprocessable Entity for validation errors
    }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { revert } = req.body;

        if (!id) {
            return res
                .status(400)
                .json({ error: "Transaction ID is required" });
        }

        const transaction = await transactionService.getTransactionById(
            id,
            req.user.userId
        );

        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        // If revert is true, adjust the user's wallet balance
        if (revert) {
            await transactionService.adjustUserBalance(
                transaction,
                req.user.userId
            );
        }

        // Delete the transaction
        await transactionService.deleteTransaction(
            id,
            req.user.userId
        );

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to delete transaction" });
    }
};

// User Analytics: Total Income and Expenses
const getUserAnalytics = async (req, res) => {
    try {
        const { userId } = req.user;
        const analytics = await transactionService.getUserAnalytics(userId);
        res.status(200).json(analytics);
    } catch (err) {
        res.status(500).json({ error: "Unable to fetch analytics" }); // Server error for unexpected failures
    }
};

module.exports = {
    createTransaction,
    getTransactionsByUserId,
    updateTransaction,
    deleteTransaction,
    getUserAnalytics,
    getTransactionById,
};
