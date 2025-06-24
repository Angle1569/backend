// models/SaleBill.js
const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, default: "" },
  paymentMethod: { type: String },
  billDate: { type: Date },
  type: { type: String, enum: ["Retail", "Wholesale"], default: "Retail" },
  time: { type: String, default: () => new Date().toLocaleTimeString() },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Cancelled"],
    default: "Pending",
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserData" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserData" },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },

  amountSection: {
    billAmount: Number,
    gst: Number,
    gstBillAmount: Number,
    billDiscount: Number,
    urdAmount: Number,
    manualUrdAmt: Number,
    netBalance: Number,
    totalBalance: Number,
    amtReceived: Number,
  },

  saleItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantitySold: Number,
      soldWeightInGrams: Number,
      rate: Number,
      total: Number,
      purity: String,
      makingCharge: Number,
      productName: String,
    },
  ],

  urdItems: [
    {
      oldProduct: { type: String, ref: "OldMetal" },
      netWt: Number,
      purity: String,
      rate: Number,
      mkgAmount: Number,
      totalAmount: Number,
    },
  ],
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
