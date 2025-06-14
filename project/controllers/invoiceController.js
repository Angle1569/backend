const Invoice = require("../models/SaleBill");
const Product = require("../models/Product");

async function createInvoice(req, res) {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const invoiceItems = [];

    for (const item of items) {
      const product = await Product.findOne({ item_id: item.item_id });

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with item_id ${item.item_id} not found` });
      }

      const currentQty = parseFloat(product.quentity) || 0;
      const requestQty = parseFloat(item.quantity);

      if (currentQty < requestQty) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for item_id ${item.item_id}` });
      }

      // Deduct quantity
      product.quentity = (currentQty - requestQty).toString();
      await product.save();

      invoiceItems.push({
        item_id: item.item_id,
        quantity: requestQty,
        productRef: product._id,
      });
    }

    const invoice = new Invoice({ items: invoiceItems });
    await invoice.save();

    res.status(201).json({ message: "Invoice created successfully", invoice });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { createInvoice };
