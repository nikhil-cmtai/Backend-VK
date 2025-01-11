const express = require("express");
const { 
  createAppointment, 
  getAppointments, 
  getAppointmentById, 
  updateAppointment, 
  deleteAppointment 
} = require("../services/appointmentServices");
const { successResponse, errorResponse } = require("../utils/responseManager");

const router = express.Router();

// Create a new appointment
router.post("/newAppointment", async (req, res) => {
  try {
    const appointmentData = req.body;
    const newAppointment = await createAppointment(appointmentData);
    successResponse(res, newAppointment, "Appointment created successfully", 201);
  } catch (error) {
    errorResponse(res, error, "Error creating appointment");
  }
});

// Get all appointments
router.get("/getAppointments", async (req, res) => {
  try {
    const appointments = await getAppointments();
    successResponse(res, appointments, "Appointments fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Error fetching appointments");
  }
});

// Get a single appointment by ID
router.get("/getAppointmentById/:id", async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await getAppointmentById(appointmentId);
    successResponse(res, appointment, "Appointment fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Appointment not found", 404);
  }
});

// Update appointment data
router.put("/updateAppointment/:id", async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointmentData = req.body;
    const updatedAppointment = await updateAppointment(appointmentId, appointmentData);
    successResponse(res, updatedAppointment, "Appointment updated successfully");
  } catch (error) {
    errorResponse(res, error, "Error updating appointment");
  }
});

// Delete an appointment
router.delete("/deleteAppointment/:id", async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const result = await deleteAppointment(appointmentId);
    successResponse(res, result, "Appointment deleted successfully");
  } catch (error) {
    errorResponse(res, error, "Error deleting appointment");
  }
});

module.exports = router;
