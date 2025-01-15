const express = require("express");
const { createPurohit, getPurohits, getPurohitById, updatePurohit, deletePurohit, fetchActivePurohits } = require("../services/purohitServices");
const { successResponse, errorResponse } = require("../utils/responseManager");
const { uploadImage, upload } = require("../controllers/imageController"); // Import the image controller

const router = express.Router();

// Create a new purohit
router.post("/newPurohit", upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'yogyagtaPramanPatra', maxCount: 1 },
    { name: 'idProof', maxCount: 1 }
]), async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).send({ message: req.fileValidationError });
    }

    const purohitData = req.body;

    // Handle profile image upload
    if (req.files['profileImage']) {
      const imageUrl = await uploadImage(req.files['profileImage'][0]);
      purohitData.profileImage = imageUrl;
    }

    // Handle yogyagtaPramanPatra upload
    if (req.files['yogyagtaPramanPatra']) {
      const yogyagtaPramanPatraUrl = await uploadImage(req.files['yogyagtaPramanPatra'][0]);
      purohitData.yogyagtaPramanPatra = yogyagtaPramanPatraUrl;
    }

    // Handle idProof upload
    if (req.files['idProof']) {
      const idProofUrl = await uploadImage(req.files['idProof'][0]);
      purohitData.idProof = idProofUrl;
    }

    const newPurohit = await createPurohit(purohitData);
    successResponse(res, newPurohit, "Purohit created successfully", 201);
  } catch (error) {
    errorResponse(res, error, "Error creating purohit");
  }
});


// Get all active purohits
router.get("/getActivePurohits", async (req, res) => {
  try {
    const purohits = await fetchActivePurohits();
    successResponse(res, purohits, "Purohits fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Error fetching purohits");
  }
});

// Get all purohits
router.get("/getAllPurohits", async (req, res) => {
  try {
    const purohits = await getPurohits();
    successResponse(res, purohits, "Purohits fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Error fetching purohits");
  }
});

// Get a single purohit by ID
router.get("/getPurohitById/:id", async (req, res) => {
  try {
    const purohitId = req.params.id;
    const purohit = await getPurohitById(purohitId);
    successResponse(res, purohit, "Purohit fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Purohit not found", 404);
  }
});

// Update purohit data
router.put("/updatePurohit/:id", upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'yogyagtaPramanPatra', maxCount: 1 },
    { name: 'idProof', maxCount: 1 }
]), async (req, res) => {
  try {
    const purohitId = req.params.id;
    const purohitData = req.body;

    // If a new profile image is uploaded, handle the image upload via the imageController
    if (req.files['profileImage']) {
      const imageUrl = await uploadImage(req.files['profileImage'][0]); // Upload the image and get the URL
      purohitData.profileImage = imageUrl; // Save the image URL in the updated purohit data
    }

    // If a new yogyagtaPramanPatra is uploaded
    if (req.files['yogyagtaPramanPatra']) {
      const yogyagtaPramanPatraUrl = await uploadImage(req.files['yogyagtaPramanPatra'][0]);
      purohitData.yogyagtaPramanPatra = yogyagtaPramanPatraUrl;
    }

    // If a new idProof is uploaded
    if (req.files['idProof']) {
      const idProofUrl = await uploadImage(req.files['idProof'][0]);
      purohitData.idProof = idProofUrl;
    }

    const updatedPurohit = await updatePurohit(purohitId, purohitData);
    successResponse(res, updatedPurohit, "Purohit updated successfully");
  } catch (error) {
    errorResponse(res, error, "Error updating purohit");
  }
});

// Delete a purohit
router.delete("/deletePurohit/:id", async (req, res) => {
  try {
    const purohitId = req.params.id;
    const result = await deletePurohit(purohitId);
    successResponse(res, result, "Purohit deleted successfully");
  } catch (error) {
    errorResponse(res, error, "Error deleting purohit");
  }
});

module.exports = router;
