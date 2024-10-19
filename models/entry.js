const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  productName: { type: String },
  quantity: { type: Number },
  userNum: { type: Number },
  approvalStatus: { type: String },
  number: { type: Number },
  date: { type: Date }
}, { strict: false });

module.exports = mongoose.model('Entry', entrySchema);
