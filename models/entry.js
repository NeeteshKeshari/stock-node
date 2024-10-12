const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  productName: { type: String },
  quantity: { type: Number },
  date: { type: Date }
}, { strict: false });

module.exports = mongoose.model('Entry', entrySchema);
