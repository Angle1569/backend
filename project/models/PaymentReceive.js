const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    invoiceNo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    customerName: { type: String, required: true },
    mobile: { type: String },
    date: { type: String },
    amountPaid: { type: Number, required: true },
    paymentMode: { type: String }, // Cash, UPI, Card etc.
    receivedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
