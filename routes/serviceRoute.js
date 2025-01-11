const express = require("express");
const { createservice, getservices, getserviceById, updateservice, deleteservice } = require("../services/serviceServices");
const { successResponse, errorResponse } = require("../utils/responseManager");

const router = express.Router();

// Create a new service
router.post("/newData", async (req, res) => {
  try {
    const serviceData = req.body;
    const newService = await createservice(serviceData);
    successResponse(res, newService, "Service created successfully", 201);
  } catch (error) {
    errorResponse(res, error, "Error creating service");
  }
});

// Get all services
router.get("/getService", async (req, res) => {
  try {
    const services = await getservices();
    successResponse(res, services, "Services fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Error fetching services");
  }
});

// Get a single service by ID
router.get("/getServiceById/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;
    const service = await getserviceById(serviceId);
    successResponse(res, service, "Service fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Service not found", 404);
  }
});

// Update service data
router.put("/updateService/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;
    const serviceData = req.body;
    const updatedService = await updateservice(serviceId, serviceData);
    successResponse(res, updatedService, "Service updated successfully");
  } catch (error) {
    errorResponse(res, error, "Error updating service");
  }
});

// Delete a service
router.delete("/deleteService/:id", async (req, res) => {
  try {
    const serviceId = req.params.id;
    const result = await deleteservice(serviceId);
    successResponse(res, result, "Service deleted successfully");
  } catch (error) {
    errorResponse(res, error, "Error deleting service");
  }
});

module.exports = router;
