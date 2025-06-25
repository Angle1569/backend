const UrdPurchase = require("../models/UrdPurchase");

const generateInvoiceNumber = async () => {
  const count = await UrdPurchase.countDocuments();
  return `URD-${String(count + 1).padStart(4, "0")}`;
};

async function addOldGood(req, res) {
  try {
    const {
      customerName,
      mobile,
      billDate,
      items = [],
      paymentmode,
    } = req.body;

    if (!customerName || !mobile) {
      return res
        .status(404)
        .json({ message: "name and mobile no are required" });
    }

    const billNo = await generateInvoiceNumber();

    const newBill = new UrdPurchase({
      billNo,
      customerName,
      mobile,
      billDate,
      paymentmode,
      items,
    });

    await newBill.save();

    res.status(201).json({ message: "Product added successful", status: true });
  } catch (error) {
    console.error("error old good", error);
    res.status(500).json({
      message: "Failed to Add Product",
    });
  }
}

async function getBillList(req, res) {
  try {
    const { search = "", page = 1, limit = 30 } = req.query;

    const query = search
      ? {
          $or: [
            { customerName: { $regex: search, $options: "i" } },
            { billNo: { $regex: search, $options: "i" } },
            { mobile: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalItems = await OldMetal.countDocuments(query);

    const bill = await UrdPurchase.find(query)
      .select("-_id -__v")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ billDate: -1 });

    return res.status(200).json({
      message: "Products fetched successfully",
      status: true,
      bill,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: parseInt(page),
      pageSize: parseInt(limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  addOldGood,
  getBillList,
};
