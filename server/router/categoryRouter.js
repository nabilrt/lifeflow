const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const checkLogin = require("../middleware/checkLogin");

router.post("/add", checkLogin, categoryController.createCategory);
router.get("/:id", checkLogin, categoryController.getCategoryById);
router.put("/:id", checkLogin, categoryController.updateCategory);
router.get("/all/me", checkLogin, categoryController.getCategoriesByUserId);
router.delete("/:id", checkLogin, categoryController.deleteCategory);

module.exports = router;
