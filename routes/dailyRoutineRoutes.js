const express = require("express");
const { 
    createDailyRoutine, 
    getDailyRoutines, 
    getDailyRoutineByDate, 
    updateDailyRoutine, 
    deleteDailyRoutine 
} = require("../services/dailyRoutineServices");
const { successResponse, errorResponse } = require("../utils/responseManager");

const router = express.Router();

// Create a new daily routine
router.post("/newDailyRoutine", async (req, res) => {
  try {
    const routineData = req.body;
    const newRoutine = await createDailyRoutine(routineData);
    successResponse(res, newRoutine, "Daily routine created successfully", 201);
  } catch (error) {
    errorResponse(res, error, "Error creating daily routine");
  }
});

// Get all daily routines
router.get("/getDailyRoutines", async (req, res) => {
  try {
    const routines = await getDailyRoutines();
    successResponse(res, routines, "Daily routines fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Error fetching daily routines");
  }
});

// Get a daily routine by date
router.get("/getDailyRoutineByDate/:date", async (req, res) => {
  try {
    const date = req.params.date; // Date in YYYY-MM-DD format
    const routine = await getDailyRoutineByDate(date);
    successResponse(res, routine, "Daily routine fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Daily routine not found", 404);
  }
});

// Update a daily routine
router.put("/updateDailyRoutine/:id", async (req, res) => {
  try {
    const routineId = req.params.id;
    const routineData = req.body;
    const updatedRoutine = await updateDailyRoutine(routineId, routineData);
    successResponse(res, updatedRoutine, "Daily routine updated successfully");
  } catch (error) {
    errorResponse(res, error, "Error updating daily routine");
  }
});

// Delete a daily routine
router.delete("/deleteDailyRoutine/:id", async (req, res) => {
  try {
    const routineId = req.params.id;
    const result = await deleteDailyRoutine(routineId);
    successResponse(res, result, "Daily routine deleted successfully");
  } catch (error) {
    errorResponse(res, error, "Error deleting daily routine");
  }
});

module.exports = router;
