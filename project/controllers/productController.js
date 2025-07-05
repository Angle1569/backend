const Product = require("../models/Product");
const mongoose = require("mongoose");

async function addProduct(req, res) {
  try {
    const {
      productName,
      totalQuantity,
      productType,
      productGroup,
      totalWeightInGrams,
      unitOfMeasure,
    } = req.body;

    if (!productName) {
      return res.status(404).json({ message: "product Name are required" });
    }

    const count = await Product.countDocuments();
    const itemId = `PROD-${String(count + 1).padStart(3, "0")}`;

    // Check for existing itemId
    const existing = await Product.findOne({ itemId });
    if (existing) {
      return res
        .status(404)
        .json({ message: "Product with this Name already exists" });
    }

    const newProduct = new Product({
      itemId,
      productName,
      totalQuantity,
      productType,
      productGroup,
      totalWeightInGrams,
      unitOfMeasure,
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
      { itemId: req.params.id },
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
      itemId: req.params.id,
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
    const { search = "", page = 1, limit = 30, type } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const baseFilter = type
      ? { productType: { $regex: `^${type}$`, $options: "i" } }
      : { productType: { $in: ["gold", "silver"] } };

    const query = search
      ? {
          ...baseFilter,
          $or: [
            { productName: { $regex: search, $options: "i" } },
            { itemId: { $regex: search, $options: "i" } },
            { productType: { $regex: search, $options: "i" } },
          ],
        }
      : baseFilter;

    const totalItems = await Product.countDocuments(query);

    const products = await Product.find(query)
      .select("-_id -__v")
      .skip(skip)
      .limit(parseInt(limit));

    const allMatchingProducts = await Product.find(query);
    const totalWeight = allMatchingProducts.reduce(
      (acc, product) => {
        acc.totalWeightInGrams += product.totalWeightInGrams || 0;
        acc.soldWeightInGrams += product.soldWeightInGrams || 0;
        acc.remainingWeightInGrams += product.remainingWeightInGrams || 0;
        return acc;
      },
      {
        totalWeightInGrams: 0,
        soldWeightInGrams: 0,
        remainingWeightInGrams: 0,
      }
    );

    return res.status(200).json({
      message: "Products fetched successfully",
      status: true,
      products,
      totalItems,
      totalWeightInGrams: totalWeight,
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

// async function updateProductStock(productId, soldQty, soldWgt) {
//   const product = await Product.findById(productId);

//   if (!product) throw new Error("Product not found");

//   product.soldQuantity += soldQty;
//   product.remainingQuantity -= soldQty;

//   product.soldWeight += soldWgt;
//   product.remainingWeight -= soldWgt;

//   product.is_sold =
//     product.remainingQuantity <= 0 || product.remainingWeight <= 0;

//   await product.save();
// }

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProductId,
};
