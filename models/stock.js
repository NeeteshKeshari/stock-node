const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  rawMaterialName: { type: String },
  quantity: { type: Number },
  price: { type: Number },
  date: { type: Date }
}, { strict: false });

module.exports = mongoose.model('Stock', stockSchema);
