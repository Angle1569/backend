const mongoose = require("mongoose");

const UrdSchema = new mongoose.Schema(
  {
    billNo: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    billDate: {
      type: String,
    },
    paymentmode: {
      type: String,
    },
    items: [
      {
        oldProductName: String,
        purity: String,
        netWeight: Number,
        rate: Number,
        mkgAmount: Number,
        totalAmount: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("urd", UrdSchema);
