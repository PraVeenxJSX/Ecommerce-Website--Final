const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../config/multer");

// GET ALL PRODUCTS (with optional category filter)
router.get("/", getProducts);

// SEARCH PRODUCTS
router.get("/search", searchProducts);

// GET SINGLE PRODUCT
router.get("/:id", getProductById);

// CREATE PRODUCT (Admin)
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  createProduct
);

// UPDATE PRODUCT (Admin)
router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  updateProduct
);

// DELETE PRODUCT (Admin)
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
