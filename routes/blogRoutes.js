const express = require("express");
const { 
  createBlog, 
  getBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog 
} = require("../services/blogServices");
const { successResponse, errorResponse } = require("../utils/responseManager");
const { uploadFile, upload } = require("../controllers/blogController");

const router = express.Router();

// Create a new blog
router.post("/newBlog", upload.single('media'), async (req, res) => {
  try {
    const blogData = req.body;

    // If a media file is uploaded, handle the file upload via uploadFile
    if (req.file) {
      const uploadedMedia = await uploadFile(req.file);
      if (uploadedMedia.blogImage) {
        blogData.blogImage = uploadedMedia.blogImage; // Image URL
        blogData.type = "image"; // Set type to image
      } else if (uploadedMedia.videoUrl) {
        blogData.videoUrl = uploadedMedia.videoUrl; // Video URL
        blogData.type = "video"; // Set type to video
      }
    }

    const newBlog = await createBlog(blogData);
    successResponse(res, newBlog, "Blog created successfully", 201);
  } catch (error) {
    errorResponse(res, error, "Error creating blog");
  }
});

// Get all blogs
router.get("/getBlogs", async (req, res) => {
  try {
    const blogs = await getBlogs();
    successResponse(res, blogs, "Blogs fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Error fetching blogs");
  }
});

// Get a single blog by ID
router.get("/getBlogById/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await getBlogById(blogId);
    successResponse(res, blog, "Blog fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Blog not found", 404);
  }
});

// Update blog data
router.put("/updateBlog/:id", upload.single('media'), async (req, res) => {
  try {
    const blogId = req.params.id;
    const blogData = req.body;

    // If a new media file is uploaded, handle the file upload via uploadFile
    if (req.file) {
      const uploadedMedia = await uploadFile(req.file);
      if (uploadedMedia.blogImage) {
        blogData.blogImage = uploadedMedia.blogImage; // Image URL
        blogData.type = "image"; // Set type to image
      } else if (uploadedMedia.videoUrl) {
        blogData.videoUrl = uploadedMedia.videoUrl; // Video URL
        blogData.type = "video"; // Set type to video
      }
    }

    const updatedBlog = await updateBlog(blogId, blogData);
    successResponse(res, updatedBlog, "Blog updated successfully");
  } catch (error) {
    errorResponse(res, error, "Error updating blog");
  }
});

// Delete a blog
router.delete("/deleteBlog/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    const result = await deleteBlog(blogId);
    successResponse(res, result, "Blog deleted successfully");
  } catch (error) {
    errorResponse(res, error, "Error deleting blog");
  }
});

module.exports = router;
