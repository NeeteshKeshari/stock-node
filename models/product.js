const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  selectedProduct: { type: String, required: true },
  quantity: { type: Number, required: true }, // Set quantity to required
  actualCost: { type: Number, required: true }, // Set actualCost to required
  sellingCost: { type: Number, required: true } // Set sellingCost to required
}, { strict: false });

module.exports = mongoose.model('Product', productSchema);
