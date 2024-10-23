const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
  product: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  cost: { type: Number, required: true },
  date: { type: Date, required: true },
  customerName: { type: String, required: true },
  customerAddress: { type: String, required: true },
  amountPaid: [
    {
      amount: { type: Number, required: true },
      date: { type: Date, required: true }
    }
  ],
  amountDue: { type: Number, required: true },
  totalDue: { type: Number, required: true }
}, { strict: false });

module.exports = mongoose.model('Sales', salesSchema);
