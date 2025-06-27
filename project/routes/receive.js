const express = require("express");
const { receivePayment } = require("../controllers/payementController");
const Invoice = require("../models/Invoice");
const PaymentReceive = require("../models/PaymentReceive");
const UrdPurchase = require("../models/UrdPurchase");
const router = express.Router();

router.post("/receive-payment", receivePayment);

router.get("/payment-report", async (req, res) => {
  try {
    const { fromDate, toDate, customerId } = req.query;

    const query = {
      data: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      },
    };

    if (customerId) {
      query.customerId = customerId;
    }

    const sales = await Invoice.find(query);
    const payments = await PaymentReceive.find({ ...query, type: "received" });
    const urds = await UrdPurchase.find(query);

    const totalSale = sales.reduce((sum, s) => sum + s.amount, 0);
    const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalURD = urds.reduce((sum, u) => sum + u.amount, 0);

    res.status(200).json({
      totalSale,
      totalReceived,
      totalURD,
      sales,
      payments,
      urds,
    });
  } catch (error) {}
  console.error(err);
  res.status(500).json({ message: "Error generating report" });
});
// router.get("/payment-report/:mobile", (req, res) => {
//   const { mobile } = req.params;
//   // Logic to fetch and return the payment report for a specific mobile number
//   res.json({ message: `Payment report for ${mobile} will be here.` });
// });

module.exports = router;
