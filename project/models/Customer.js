// models/Customer.js
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customId: {
      type: Number,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    adhaar: {
      type: String,
    },
    pancard: {
      type: String,
    },
    openbalance: {
      type: Number,
    },
    billAmount: {
      type: Number,
    },
    amtReceived: { type: Number },
    balance: { type: Number },
    paymentmode: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);
