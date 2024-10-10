const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  selectedProduct: { type: String, required: true },
  quantity: { type: Number },
  actualCost: { type: Number },
  sellingCost: { type: Number },
}, { strict: false });

module.exports = mongoose.model('Product', productSchema);
