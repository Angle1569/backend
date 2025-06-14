const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    item_id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    item_type: {
      type: String,
    },
    item_group: {
      type: String,
    },
    quentity: {
      type: String,
    },
    item_weight: {
      type: String,
    },
    item_uon: {
      type: String,
    },
    is_sold: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
