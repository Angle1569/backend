const mongoose = require("mongoose");

const stockHistorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    action: {
      type: String,
      enum: ["added", "updated", "sold", "returned", "refined", "adjusted"],
      required: true,
    },
    quantityChanged: { type: Number, default: 0 },
    weightChanged: { type: Number, default: 0 },
    previousQuantity: { type: Number },
    previousWeight: { type: Number },
    newQuantity: { type: Number },
    newWeight: { type: Number },
    referenceId: { type: String }, // e.g., invoice number
    remarks: { type: String, default: "" },
    changedBy: { type: String }, // Optional: user/admin name
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StockHistory", stockHistorySchema);
