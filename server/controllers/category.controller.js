const categoryService = require("../services/category.services");

const createCategory = async (req, res) => {
    try {
        const data = req.body;

        const category = await categoryService.createCategory({
            ...data,
            userId: req.user.userId,
        });
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const userId = req.user.userId; // User ID should be sent in the body.

        const data = req.body;

        const category = await categoryService.updateCategory(
            categoryId,
            userId,
            data
        );
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id, userId);

        res.status(200).json({ success: true, category });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getCategoriesByUserId = async (req, res) => {
    try {
        const userId = req.user.userId;
        const categories = await categoryService.getCategoriesByUserId(userId);

        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const userId = req.user.userId; // User ID should be sent in the body.

        await categoryService.deleteCategory(categoryId, userId);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully.",
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    createCategory,
    updateCategory,
    getCategoriesByUserId,
    deleteCategory,
    getCategoryById,
};
