const express = require("express");
const userRoutes = require("./userRouter");
const tourRouter = require("./tourRouter");
const transactionRoutes = require("./transactionRouter");
const taskRouter = require("./taskRouter");
const categoryRouter = require("./categoryRouter");
const router = express.Router();

// Use the individual route files
router.use("/user", userRoutes); // User-related routes
router.use("/transactions", transactionRoutes); // Transaction-related routes
router.use("/tour", tourRouter); // Tour-related routes
router.use("/task", taskRouter); // Task-related routes
router.use("/category", categoryRouter); // Category-related routes

module.exports = router;
