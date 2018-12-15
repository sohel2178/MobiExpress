const mongoose = require('mongoose');

const tranSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: { type: Date, default: Date.now },
    purpose: { type: String, required: true },
    device_id: { type: String, required: true },
    customer_id: { type: String, required: true },
    head: { type: mongoose.Schema.Types.ObjectId, ref:'Head', required: true },
    amount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Tran', tranSchema);