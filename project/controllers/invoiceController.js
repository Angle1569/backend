const Customer = require("../models/Customer");
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
      mobile,
      address = "",
      paymentMethod,
      billDate,
      type = "Retail",
      createdBy,
      amountSection,
      saleItems,
      urdItems,
    } = req.body;

    console.log("Body received:", req.body);

    if (!customerName || !mobile) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (saleItems.length === 0 && urdItems.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one sale or URD item is required." });
    }

    let customer = await Customer.findOne({ mobile });

    if (!customer) {
      customer = new Customer({
        customerName,
        mobile,
        address,
        openbalance: 0,
        billAmount: amountSection?.billAmount || 0,
        amtReceived: amountSection?.amtReceived || 0,
        balance:
          (amountSection?.totalBalance || 0) -
          (amountSection?.amtReceived || 0),
        createdBy,
      });
      await customer.save();
    }

    const processedSaleItems = [];

    for (const item of saleItems) {
      const {
        itemId,
        quantitySold = 0,
        rate = 0,
        weightSold = 0,
        mkgAtm = 0,
        purity,
        productName,
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
        product.remainingWeightInGrams < weightSold
      ) {
        return res.status(400).json({
          message: `Insufficient stock for product: ${product.productName}`,
        });
      }

      // Update stock
      product.soldQuantity += quantitySold;
      product.soldWeightInGrams += weightSold;
      product.remainingQuantity -= quantitySold;
      product.remainingWeightInGrams -= weightSold;
      product.isSoldOut =
        product.remainingQuantity <= 0 || product.remainingWeightInGrams <= 0;

      await product.save();

      // const total = parseFloat((rate * netWt + mkgAtm).toFixed(2));
      // totalAmount += total;

      processedSaleItems.push({
        product: product._id,
        soldWeightInGrams: weightSold,
        rate,
        purity,
        makingCharge: mkgAtm,
        productName,
      });
    }

    const invoiceNo = await generateInvoiceNumber();

    const newInvoice = new Invoice({
      invoiceNo,
      customerName,
      mobile,
      address,
      paymentMethod,
      billDate,
      type,
      time: new Date().toLocaleTimeString(),

      amountSection: {
        ...amountSection,
      },
      saleItems: processedSaleItems,
      urdItems,
      createdBy,
    });

    await newInvoice.save();

    res.status(201).json({
      message: "Invoice created successfully",
    });
  } catch (err) {
    console.error("Invoice Error:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
}

async function getInvoiceList(req, res) {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {
      $or: [
        { customerName: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ],
    };

    const invoice = await Invoice.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Invoice.countDocuments(query);

    res.status(200).json({
      data: invoice,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(404).json({ message: "No record found " });
  }
}

module.exports = { createInvoice , getInvoiceList};
