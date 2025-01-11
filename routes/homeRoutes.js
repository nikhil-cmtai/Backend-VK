
const express = require("express");
const { createhome, gethomes, gethomeById, updatehome, deletehome } = require("../services/homeServices");
const { successResponse, errorResponse } = require("../utils/responseManager");

const router = express.Router();

// Create a new home
router.post("/newData", async (req, res) => {
  try {
    const homeData = req.body;
    const newhome = await createhome(homeData);
    successResponse(res, newhome, "home created successfully", 201);
  } catch (error) {
    errorResponse(res, error, "Error creating home");
  }
});

// Get all homes
router.get("/getHome", async (req, res) => {
  try {
    const homes = await gethomes();
    successResponse(res, homes, "homes fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Error fetching homes");
  }
});

// Get a single home by ID
router.get("/getHomeById/:id", async (req, res) => {
  try {
    const homeId = req.params.id;
    const home = await gethomeById(homeId);
    successResponse(res, home, "home fetched successfully");
  } catch (error) {
    errorResponse(res, error, "home not found", 404);
  }
});

// Update home data
router.put("/updateHome/:id", async (req, res) => {
  try {
    const homeId = req.params.id;
    const homeData = req.body;
    const updatedhome = await updatehome(homeId, homeData);
    successResponse(res, updatedhome, "home updated successfully");
  } catch (error) {
    errorResponse(res, error, "Error updating home");
  }
});

// Delete a home
router.delete("/deleteHome/:id", async (req, res) => {
  try {
    const homeId = req.params.id;
    const result = await deletehome(homeId);
    successResponse(res, result, "home deleted successfully");
  } catch (error) {
    errorResponse(res, error, "Error deleting home");
  }
});

module.exports = router;
