const express = require("express");
const tourController = require("../controllers/tour.controller");
const checkLogin = require("../middleware/checkLogin");
const multiUpload = require("../middleware/multiple-file-upload");

const router = express.Router();

// Create a new tour
router.post("/add", checkLogin, tourController.createTour);

// Get all tours by user ID
router.get("/all", checkLogin, tourController.getAllTours);

// Get a single tour by ID
router.get("/:id", checkLogin, tourController.getTourById);

// Update a tour (except isCompleted)
router.put("/:id", checkLogin, multiUpload, tourController.updateTour);

// Update the isCompleted status of a tour
router.patch("/:id", checkLogin, tourController.updateTourStatus);

// Delete a tour
router.delete("/:id", checkLogin, tourController.deleteTour);

module.exports = router;
