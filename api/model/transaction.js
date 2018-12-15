const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: { type: Date, default: Date.now },
    purpose: { type: String, required: true },
    device_id: { type: String, required: true },
    customer_id: { type: String, required: true },
    invoice_no: { type: String },
    from: { type: mongoose.Schema.Types.ObjectId, ref:'Account', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref:'Account', required: true },
    amount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Transaction', transactionSchema);