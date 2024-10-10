const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerName: { type: String },
    customerAddress: { type: String },
    sales: [
        {
            product: String,
            date: Date,
            quantity: Number,
            cost: Number,
            amountPaid: Number,
            amountDue: Number,
            totalDue: Number,
        }
    ]
}, { strict: false });

module.exports = mongoose.model('Customer', customerSchema);
