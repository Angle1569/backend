const mongoose = require("mongoose");

// const saleBillSchema = new mongoose.Schema({
//   billNumber: { type: String, required: true, unique: true },
//   c_name: { type: String, required: true },
//   mobile_no: { type: String, required: true },
//   address: { type: String, default: "" },
//   billDate: { type: Date, default: Date.now },
//   billType: { type: String, enum: ["Retail", "Wholesale"], default: "Retail" },
//   paymentMethod: {
//     type: String,
//     enum: ["Cash", "Card", "UPI"],
//     default: "Cash",
//   },
//   billTime: { type: String, default: new Date().toLocaleTimeString() },
//   billStatus: {
//     type: String,
//     enum: ["Pending", "Completed", "Cancelled"],
//     default: "Pending",
//   },

//   billCreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserData" },
//   billUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserData" },
//   billUpdatedAt: { type: Date, default: Date.now },
//   billDueDate: { type: Date, default: null },
//   billDueAmount: { type: Number, default: 0 },
//   billDiscount: { type: Number, default: 0 },
//   billTax: { type: Number, default: 0 },
//   billTotal: { type: Number, required: true },
//   billPaid: { type: Number, default: 0 },
//   billChange: { type: Number, default: 0 },
//   billRemarks: { type: String, default: "" },
//   billItems: [
//     {
//       product: { type: mongoose.Schema.Types.ObjectId, ref: "ProductData" },
//       quantity: { type: Number, required: true },
//       price: { type: Number, required: true },
//       total: { type: Number, required: true },
//       discount: { type: Number, default: 0 },
//       weight: { type: Number, default: 0 },
//     },
//   ],
//   // billSubTotal: { type: Number, required: true },

// });

const invoiceSchema = new mongoose.Schema(
  {
    items: [
      {
        item_id: { type: String, required: true },
        quantity: { type: Number, required: true },
        productRef: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductData",
        },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
