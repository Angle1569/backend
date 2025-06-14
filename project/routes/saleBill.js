const express = require("express");
const router = express.Router();
const SaleBill = require("../models/SaleBill");

// 🔹 Create Sale Bill
router.post("/bill", async (req, res) => {
  try {
    const saleBill = new SaleBill(req.body);
    const saved = await saleBill.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Get All Bills (with search + pagination)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const filter = search
      ? {
          $or: [
            { c_name: { $regex: search, $options: "i" } },
            { mobile_no: { $regex: search, $options: "i" } },
            { billNumber: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const bills = await SaleBill.find(filter)
      .populate("billCreatedBy billUpdatedBy billItems.product")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ billDate: -1 });

    const totalCount = await SaleBill.countDocuments(filter);

    res.json({
      data: bills,
      total: totalCount,
      page: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Get Sale Bill by ID
router.get("/:id", async (req, res) => {
  try {
    const bill = await SaleBill.findById(req.params.id).populate(
      "billCreatedBy billUpdatedBy billItems.product"
    );
    if (!bill) return res.status(404).json({ error: "Sale bill not found" });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Update Sale Bill
router.put("/:id", async (req, res) => {
  try {
    const updated = await SaleBill.findByIdAndUpdate(
      req.params.id,
      { ...req.body, billUpdatedAt: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 🔹 Delete Sale Bill
// router.delete("/:id", async (req, res) => {
//   try {
//     const deleted = await SaleBill.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted successfully", bill: deleted });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;
