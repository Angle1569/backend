const OldMetal = require("../models/OldMetal");

async function addOldGood(req, res) {
  try {
    const {
      customerName,
      mobile,
      billDate,
      oldProductName,
      netWeight,
      purity,
      paymentmode,
      rate,
      mkgAmount,
      totalAmount,
    } = req.body;

    if (!customerName || !mobile) {
      return res
        .status(404)
        .json({ message: "name and mobile no are required" });
    }

    const count = await OldMetal.countDocuments();
    const billNo = `${String(count + 1).padStart(3, "0")}`;

    const existing = await OldMetal.findOne({ billNo });
    if (existing) {
      return res
        .status(404)
        .json({ message: "Bill this number already exist" });
    }

    const newBill = new OldMetal({
      billNo,
      customerName,
      purity,
      paymentmode,
      totalAmount,
      mobile,
      mkgAmount,
      billDate,
      rate,
      oldProductName,
      netWeight,
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

    const bill = await OldMetal.find(query)
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

async function getBillId(req, res) {
  const last = await OldMetal.findOne().sort({ createdAt: -1 });

  const lastNo = last?.billNo?.split("-")[1] || "0000";
  const nextNo = String(Number(lastNo) + 1).padStart(4, "0");

  res.json({ billNo: `BILL-${nextNo}` });
}

module.exports = {
  addOldGood,
  getBillList,
  getBillId,
};
