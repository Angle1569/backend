const PaymentReceive = require("../models/PaymentReceive");
const Customer = require("../models/Customer");
const Invoice = require("../models/Invoice");

const generateInvoiceNumber = async () => {
  const count = await PaymentReceive.countDocuments();
  return `REC${String(count + 1).padStart(4, "0")}`;
};

async function receivePayment(req, res) {
  try {
    const { mobile, amountPaid, paymentMode, receivedBy } = req.body;

    if (!mobile || !amountPaid) {
      return res
        .status(400)
        .json({ message: "Invoice ID and payment amount are required." });
    }

    let invoice = await Invoice.findOne({
      mobile,
      status: { $ne: "Completed" },
    }).sort({ createdAt: -1 });

    let customer = await Customer.findOne({ mobile });
    const customerName = customer?.customerName || "Unknown";
    const address = customer?.address || "";

    if (!invoice) {
      const recNo = await generateInvoiceNumber();
      invoice = new Invoice({
        recNo,
        customerName,
        address,
        type: "Retail",
        billDate: new Date(),
        time: new Date().toLocaleTimeString(),
        status: "Pending",
        amountSection: {
          billAmount: 0,
          totalBalance: amountPaid,
          amtReceived: 0,
        },
      });
      await invoice.save();
    }

    const prevReceived = invoice.amountSection?.amtReceived || 0;
    const prevBalance = invoice.amountSection?.totalBalance || 0;

    const newAmtReceived = prevReceived + amountPaid;
    const newBalance = Math.max(prevBalance - amountPaid, 0);

    // Update invoice balance
    invoice.amountSection.amtReceived = newAmtReceived;
    invoice.amountSection.totalBalance = newBalance;
    if (newBalance === 0) {
      invoice.status = "Completed";
    }
    await invoice.save();

    // Save Payment record
    const payment = new PaymentReceive({
      invoice: invoice._id,
      customerName: invoice.customerName,
      mobile: invoice.mobile,
      amountPaid,
      paymentMode,
      receivedBy,
    });
    await payment.save();

    res.status(200).json({
      message: "Payment received and invoice updated.",
    });
  } catch (err) {
    console.error("Receive Payment Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

module.exports = { receivePayment };
