const express = require("express");
const transactionController = require("../controllers/transaction.controller");
const checkLogin = require("../middleware/checkLogin");
const router = express.Router();

// CRUD routes
router.post("/add", checkLogin, transactionController.createTransaction); // Create a new transaction
router.get("/me", checkLogin, transactionController.getTransactionsByUserId); // Get transactions by user ID
router.get("/analytics", checkLogin, transactionController.getUserAnalytics); // Get analytics by user ID
router.get("/:id", checkLogin, transactionController.getTransactionById); // Get transaction by ID
router.put("/:id", checkLogin, transactionController.updateTransaction); // Update transaction by ID
router.delete("/:id", checkLogin, transactionController.deleteTransaction); // Delete transaction by ID

module.exports = router;
