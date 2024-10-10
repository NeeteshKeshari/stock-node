const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  selectedProduct: { type: String, required: true },
  quantity: { type: Number, required: true },
  actualCost: { type: Number, required: true },
  sellingCost: { type: Number, required: true },
}, { strict: false });

module.exports = mongoose.model('Product', productSchema);
