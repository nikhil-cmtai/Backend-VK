
const express = require("express");
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require("../services/userServices");
const { successResponse, errorResponse } = require("../utils/responseManager");
const { uploadImage, upload } = require("../controllers/imageController"); // Import the image controller

const router = express.Router();

// Create a new user
router.post("/newUser", upload.single('profileImage'), async (req, res) => {
  try {
    const userData = req.body;

    // If a profile image is uploaded, handle the image upload via the imageController
    if (req.file) {
      const imageUrl = await uploadImage(req.file); // Upload the image and get the URL
      userData.profileImage = imageUrl; // Save the image URL in the user data
    }

    const newUser = await createUser(userData);
    successResponse(res, newUser, "User created successfully", 201);
  } catch (error) {
    errorResponse(res, error, "Error creating user");
  }
});

// Get all users
router.get("/getUsers", async (req, res) => {
  try {
    const users = await getUsers();
    successResponse(res, users, "Users fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Error fetching users");
  }
});

// Get a single user by ID
router.get("/getUserById/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    successResponse(res, user, "User fetched successfully");
  } catch (error) {
    errorResponse(res, error, "User not found", 404);
  }
});

// Update user data
router.put("/updateUser/:id", upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = req.body;

    // If a new profile image is uploaded, handle the image upload via the imageController
    if (req.file) {
      const imageUrl = await uploadImage(req.file); // Upload the image and get the URL
      userData.profileImage = imageUrl; // Save the image URL in the updated user data
    }

    const updatedUser = await updateUser(userId, userData);
    successResponse(res, updatedUser, "User updated successfully");
  } catch (error) {
    errorResponse(res, error, "Error updating user");
  }
});

// Delete a user
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await deleteUser(userId);
    successResponse(res, result, "User deleted successfully");
  } catch (error) {
    errorResponse(res, error, "Error deleting user");
  }
});

module.exports = router;
