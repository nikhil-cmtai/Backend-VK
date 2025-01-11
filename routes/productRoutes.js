const express = require("express");
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../services/productServices");
const { successResponse, errorResponse } = require("../utils/responseManager");

const router = express.Router();

// Create a new product
router.post("/newProduct", async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await createProduct(productData);
    successResponse(res, newProduct, "Product created successfully", 201);
  } catch (error) {
    errorResponse(res, error, "Error creating product");
  }
});

// Get all products
router.get("/getProducts", async (req, res) => {
  try {
    const products = await getProducts();
    successResponse(res, products, "Products fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Error fetching products");
  }
});

// Get a single product by ID
router.get("/getProductById/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await getProductById(productId);
    successResponse(res, product, "Product fetched successfully");
  } catch (error) {
    errorResponse(res, error, "Product not found", 404);
  }
});

// Update product data
router.put("/updateProduct/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = req.body;
    const updatedProduct = await updateProduct(productId, productData);
    successResponse(res, updatedProduct, "Product updated successfully");
  } catch (error) {
    errorResponse(res, error, "Error updating product");
  }
});

// Delete a product
router.delete("/deleteProduct/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const result = await deleteProduct(productId);
    successResponse(res, result, "Product deleted successfully");
  } catch (error) {
    errorResponse(res, error, "Error deleting product");
  }
});

module.exports = router;
