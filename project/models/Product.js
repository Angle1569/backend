const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true,
    },
    productName: {
      type: String,
      required: [true, "Product name is required"],
    },
    productType: {
      type: String, // e.g., Gold, Silver, Diamond
    },
    productGroup: {
      type: String, // e.g., Ring, Chain
    },
    unitOfMeasure: {
      type: String, // e.g., gm, kg, pcs
    },
    totalQuantity: {
      type: Number,
      required: true,
      default: 0, // Total items in stock (e.g., 10 pieces)
    },
    totalWeightInGrams: {
      type: Number,
      required: true,
      default: 0, // Total weight in grams (e.g., 100 grams)
    },
    soldQuantity: {
      type: Number,
      default: 0, // Number of items sold
    },
    soldWeightInGrams: {
      type: Number,
      default: 0, // Total weight sold in grams (e.g., 15.5g)
    },
    remainingQuantity: {
      type: Number,
      default: 0, // Remaining items in stock
    },
    remainingWeightInGrams: {
      type: Number,
      default: 0, // Remaining weight in grams
    },
    isSoldOut: {
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

// Auto-calculate remaining stock before saving
ProductSchema.pre("save", function (next) {
  this.remainingQuantity = this.totalQuantity - this.soldQuantity;
  this.remainingWeightInGrams =
    this.totalWeightInGrams - this.soldWeightInGrams;

  this.isSoldOut =
    this.remainingQuantity <= 0 || this.remainingWeightInGrams <= 0;

  next();
});

module.exports = mongoose.model("Product", ProductSchema);
