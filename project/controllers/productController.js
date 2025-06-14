const Product = require("../models/Product");
const mongoose = require("mongoose");

async function addProduct(req, res) {
  try {
    const { name, quentity, item_type, item_group, item_weight, item_uon } =
      req.body;

    if (!name) {
      return res.status(404).json({ message: "name are required" });
    }

    const count = await Product.countDocuments();
    const item_id = `PROD-${String(count + 1).padStart(3, "0")}`;

    // Check for existing item_id
    const existing = await Product.findOne({ item_id });
    if (existing) {
      return res
        .status(404)
        .json({ message: "Product with this name already exists" });
    }

    const newProduct = new Product({
      item_id,
      name,
      quentity,
      item_type,
      item_group,
      item_weight,
      item_uon,
    });
    await newProduct.save();

    res.status(201).json({ message: "Product added successful", status: true });
  } catch (error) {
    res.status(400).json({
      message: "Failed to add product",
      status: false,
      error: error.message,
    });
  }
}

async function updateProduct(req, res) {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { item_id: req.params.id },
      { $set: req.body },
      { new: true }
    ).select("-_id -__v");

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ message: "Product not found", status: false });
    }

    res.status(200).json({
      message: "Product updated",
      status: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
}

async function deleteProduct(req, res) {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      item_id: req.params.id,
    });

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ message: "Product not found", status: false });
    }

    res
      .status(200)
      .json({ message: "Product deleted successfully", status: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
}

async function getProduct(req, res) {
  try {
    const { search = "", page = 1, limit = 30 } = req.query;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { item_id: { $regex: search, $options: "i" } },
            { item_type: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalItems = await Product.countDocuments(query);

    const products = await Product.find(query)
      .select("-_id -__v")
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      message: "Products fetched successfully",
      status: true,
      products,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: parseInt(page),
      pageSize: parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
}

async function getProductId(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ message: "Invalid product ID", status: false });
  }

  try {
    const product = await Product.findById(id).select("-__v");

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", status: false });
    }

    res.status(200).json({ message: "Product fetched", status: true, product });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
}

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProductId,
};
