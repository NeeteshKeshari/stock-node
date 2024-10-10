const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  product: { type: String },
  quantity: { type: Number },
  cost: { type: Number },
  date: { type: Date },
  customerName: { type: String },
  customerAddress: { type: String },
  amountPaid: { type: Number },
  amountDue: { type: Number },
  totalDue: { type: Number }
}, { strict: false });

module.exports = mongoose.model('Sales', salesSchema);
