const tourService = require("../services/tour.services");
const cloudinaryConfig = require("../config/cloudinary");
const fs = require("fs");

// Create a new tour
const createTour = async (req, res) => {
    try {
        const tour = await tourService.createTour(req.body, req.user.userId);
        res.status(201).json({
            message: "Tour created successfully",
            tour,
        });
    } catch (err) {
        res.status(422).json({ error: err.message }); // Unprocessable Entity
    }
};

// Get all tours by user ID
const getAllTours = async (req, res) => {
    try {
        const tours = await tourService.getAllToursByUserId(req.user.userId);
        res.status(200).json(tours);
    } catch (err) {
        res.status(500).json({ error: "Unable to fetch tours" }); // Internal Server Error
    }
};

// Get a single tour by ID
const getTourById = async (req, res) => {
    try {
        const { id } = req.params;
        const tour = await tourService.getTourById(id, req.user.userId);
        res.status(200).json(tour);
    } catch (err) {
        res.status(404).json({ error: err.message }); // Not Found
    }
};

// Update a tour (except isCompleted)
const updateTour = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        // Handle file uploads
        let attachments = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map((file) =>
                cloudinaryConfig.uploader.upload(file.path, {
                    resource_type: "auto",
                })
            );
            const results = await Promise.all(uploadPromises);
            attachments = results.map((result) => result.secure_url);

            // Clean up local uploaded files
            req.files.map((file) => fs.unlinkSync(file.path));
        }

        const tourData = {
            ...req.body,
            images: attachments, // Include uploaded images in the update payload
        };

        console.log(tourData);

        const tour = await tourService.updateTour(id, tourData, userId);
        res.status(200).json({
            message: "Tour updated successfully",
            tour,
        });
    } catch (err) {
        res.status(404).json({ error: err.message }); // Not Found
    }
};

// Update the isCompleted status of a tour
const updateTourStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isCompleted } = req.body;

        if (isCompleted === undefined) {
            return res.status(400).json({ error: "isCompleted is required" }); // Bad Request
        }

        const tour = await tourService.updateTourStatus(
            id,
            isCompleted,
            req.user.userId
        );
        res.status(200).json({
            message: "Tour status updated successfully",
            tour,
        });
    } catch (err) {
        res.status(404).json({ error: err.message }); // Not Found
    }
};

// Delete a tour
const deleteTour = async (req, res) => {
    try {
        const { id } = req.params;
        await tourService.deleteTour(id, req.user.userId);
        res.status(200).json({ error: "Tour Deleted successfully" }); // No content
    } catch (err) {
        res.status(404).json({ error: err.message }); // Not Found
    }
};

module.exports = {
    createTour,
    getAllTours,
    getTourById,
    updateTour,
    updateTourStatus,
    deleteTour,
};
