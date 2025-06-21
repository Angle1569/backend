// models/SaleBill.js
const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerMobile: { type: String, required: true },
  customerAddress: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  type: { type: String, enum: ["Retail", "Wholesale"], default: "Retail" },
  paymentMethod: {
    type: String,
    enum: ["Cash", "Card", "UPI"],
    default: "Cash",
  },
  time: { type: String, default: new Date().toLocaleTimeString() },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Cancelled"],
    default: "Pending",
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserData" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserData" },
  updatedAt: { type: Date, default: Date.now },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  amountRecived: { type: Number, default: 0 },
  remarks : {type: String},
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantitySold: Number,
      weightSold: Number,
      rate: Number,
      total: Number,
    },
  ],
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
