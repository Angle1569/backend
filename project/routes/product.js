const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProduct,
  getProductId,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/auth");

//Add Product
router.post("/productAdd", addProduct);

// Get all Products
router.get("/", getProduct);

//Get with ID

router.get("/:id", getProductId);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;
