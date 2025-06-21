const Invoice = require("../models/Invoice");
const Product = require("../models/Product");

// Auto-generate unique invoice number
const generateInvoiceNumber = async () => {
  const count = await Invoice.countDocuments();
  return `INV-${String(count + 1).padStart(4, "0")}`;
};

// Create Invoice Controller
async function createInvoice(req, res) {
  try {
    const {
      customerName,
      customerMobile,
      customerAddress = "",
      type = "Retail",
      paymentMethod = "Cash",
      remarks = "",
      invoiceItems,
      createdBy = null,
    } = req.body;

    if (!customerName || !customerMobile) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (!invoiceItems || invoiceItems.length === 0) {
      return res.status(400).json({ message: "Invoice items required." });
    }

    let totalAmount = 0;
    const updatedItems = [];

    // Loop through items, validate & update stock
    for (const item of invoiceItems) {
      const {
        itemId,
        quantitySold = 0,
        soldWeightInGrams = 0,
        rate = 0,
      } = item;

      if (!itemId) {
        return res
          .status(400)
          .json({ message: "itemId is missing in one of the invoice items." });
      }
      const product = await Product.findOne({ itemId });

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found with itemId: ${item.itemId}` });
      }

      if (product.remainingQuantity === 0 && product.totalQuantity > 0) {
        product.remainingQuantity = product.totalQuantity;
      }
      if (
        product.remainingWeightInGrams === 0 &&
        product.totalWeightInGrams > 0
      ) {
        product.remainingWeightInGrams = product.totalWeightInGrams;
      }

      if (
        product.remainingQuantity < quantitySold ||
        product.remainingWeight < soldWeightInGrams
      ) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.productName}`,
        });
      }

      // Update stock
      product.soldQuantity += quantitySold;
      product.soldWeightInGrams += soldWeightInGrams;
      product.remainingQuantity -= quantitySold;
      product.remainingWeightInGrams -= soldWeightInGrams;
      product.isSoldOut =
        product.remainingQuantity <= 0 || product.remainingWeightInGrams <= 0;

      await product.save();

      const total = parseFloat((rate * soldWeightInGrams).toFixed(2));
      totalAmount += total;

      updatedItems.push({
        product: product._id,
        quantitySold,
        weightSold: soldWeightInGrams,
        rate,
        total,
      });
    }

    const invoiceNo = await generateInvoiceNumber();

    const newInvoice = new Invoice({
      invoiceNo,
      customerName,
      customerMobile,
      customerAddress,
      type,
      paymentMethod,
      time: new Date().toLocaleTimeString(),
      totalAmount,
      remarks,
      items: updatedItems,
      createdBy,
    });

    await newInvoice.save();

    res.status(201).json({
      message: "Invoice created successfully",
      invoice: newInvoice,
    });
  } catch (err) {
    console.error("Invoice Error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}

module.exports = { createInvoice };
