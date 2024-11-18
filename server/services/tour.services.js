const { Tour, User, Transaction, Category } = require("../models/index");

// Create a new tour
const createTour = async (tourData, userId) => {
    const { name, place, budget } = tourData;

    if (!name || !place || !budget) {
        throw new Error("Tour name, place, and budget are required");
    }

    return await Tour.create({
        name,
        place,
        budget,
        userId,
    });
};

// Get all tours by user ID
const getAllToursByUserId = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    return await Tour.findAll({
        where: { userId },
    });
};

// Get a single tour by ID
const getTourById = async (id, userId) => {
    const tour = await Tour.findOne({ where: { id, userId } });
    if (!tour) {
        throw new Error("Tour not found");
    }
    return tour;
};

// Update a tour (except isCompleted)
const updateTour = async (id, tourData, userId) => {
    const tour = await Tour.findOne({ where: { id, userId } });

    if (!tour) {
        throw new Error("Tour not found");
    }

    const { name, place, budget, images } = tourData;

    // Allow updating images only if the tour is completed
    if (images && !tour.isCompleted) {
        throw new Error("Images can only be updated for completed tours");
    }

    return await tour.update({
        name,
        place,
        budget,
        ...(images && { images }), // Append new images to existing ones
    });
};

// Update the isCompleted value of a tour
const updateTourStatus = async (id, isCompleted, userId) => {
    const tour = await Tour.findOne({ where: { id, userId } });

    if (!tour) {
        throw new Error("Tour not found");
    }

    if (isCompleted && !tour.isCompleted) {
        // Deduct budget from user's wallet
        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error("User not found");
        }

        user.walletBalance -= tour.budget; // Allow negative balance
        await user.save();

        // Handle "Tour Expense" category
        let category = await Category.findOne({
            where: { name: "Tour Expense", userId },
        });
        if (!category) {
            category = await Category.create({ name: "Tour Expense", userId });
        }

        // Insert transaction
        await Transaction.create({
            userId,
            categoryId: category.id,
            amount: tour.budget,
            type: "debit",
            createdAt: new Date(),
        });
    }

    // Update the tour status
    return await tour.update({ isCompleted });
};

// Delete a tour
const deleteTour = async (id, userId) => {
    const tour = await Tour.findOne({ where: { id, userId } });

    if (!tour) {
        throw new Error("Tour not found");
    }

    await tour.destroy();
    return tour;
};

module.exports = {
    createTour,
    getAllToursByUserId,
    getTourById,
    updateTour,
    updateTourStatus,
    deleteTour,
};
