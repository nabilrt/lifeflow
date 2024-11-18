const { Category, Transaction } = require("../models/index");

const createCategory = async (data) => {
    const { name, userId } = data;

    if (!name || !userId) {
        throw new Error("Name and User ID are required.");
    }

    const category = await Category.create({ name, userId });
    return category;
};

const updateCategory = async (categoryId, userId, data) => {
    const category = await Category.findOne({
        where: { id: categoryId, userId },
    });

    if (!category) {
        throw new Error(
            "Category not found or you do not have permission to update it."
        );
    }

    const { name } = data;
    if (name) {
        category.name = name;
    }

    await category.save();
    return category;
};

const getCategoryById = async (id, userId) => {
    const category = await Category.findOne({
        where: { id, userId },
    });

    if (!category) {
        throw new Error(
            "Category not found or you do not have permission to delete it."
        );
    }

    return category;
};

const getCategoriesByUserId = async (userId) => {
    const categories = await Category.findAll({
        where: { userId },
        include: { model: Transaction, as: "Transactions" },
    });
    return categories;
};

const deleteCategory = async (categoryId, userId) => {
    const category = await Category.findOne({
        where: { id: categoryId, userId },
    });

    if (!category) {
        throw new Error(
            "Category not found or you do not have permission to delete it."
        );
    }

    const transactions = await Transaction.findOne({
        where: { categoryId, userId },
    });

    if (transactions) {
        throw new Error(
            "Cannot delete category because it is assigned to transactions."
        );
    }

    await category.destroy();
    return true;
};

module.exports = {
    createCategory,
    updateCategory,
    getCategoriesByUserId,
    deleteCategory,
    getCategoryById,
};
