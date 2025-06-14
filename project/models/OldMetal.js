const mongoose = require("mongoose");

const OldGoodSchema = new mongoose.Schema(
  {
    billNo: {
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
    billDate: {
      type: Number,
    },

    paymentmode: {
      type: String,
    },
    oldProductName: {
      type: String,
    },
    netWeight: {
      type: Number,
    },
    purity: {
      type: String,
    },
    rate: {
      type: Number,
    },
    mkgAmount: {
      type: Number,
    },
    totalAmount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OldMetal", OldGoodSchema);
