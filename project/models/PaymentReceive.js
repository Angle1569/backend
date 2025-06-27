const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    recNo: {
      type: String,
      unique: true,
      required: false,
    },
    customerName: { type: String, required: true },
    mobile: { type: String, required: true },
    date: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
    amountPaid: { type: Number, required: true },
    paymentMode: { type: String },
    receivedBy: { type: String },
    receivedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
