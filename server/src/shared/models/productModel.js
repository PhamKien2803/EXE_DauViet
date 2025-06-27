const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  size: { type: String },
  quantity: { type: Number, required: true },
  images: [{ type: String }],
  active: { type: Boolean, default: true }
}, { timestamp: true });

module.exports = mongoose.model("Product", productSchema);
