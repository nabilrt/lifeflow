const express = require("express");
const userController = require("../controllers/user.controller");
const analyticsController = require("../controllers/analytics.controller");
const checkLogin = require("../middleware/checkLogin");
const singleUpload = require("../middleware/file-upload");
const router = express.Router();

// CRUD routes
router.post("/add", singleUpload, userController.createUser); // Create a new user
router.post("/login", userController.loginUser); // Login
router.get("/me", checkLogin, userController.getUserById); // Get user by ID
router.put("/me", checkLogin, userController.updateUser); // Update user by ID
router.delete("/me", checkLogin, userController.deleteUser); // Delete user by ID
router.post("/avatar", checkLogin, singleUpload, userController.uploadAvatar);
router.post("/update-password", checkLogin, userController.updatePassword);
router.post("/update-wallet", checkLogin, userController.updateWalletBalance);
// Analytics route
router.get("/me/analytics", checkLogin, analyticsController.getUserAnalytics); // Get user analytics

module.exports = router;
