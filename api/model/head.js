const mongoose = require('mongoose');

const headSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    customer_id: { type: String, required: true }
});

headSchema.index({name: 1, customer_id: 1},{unique:true});

module.exports = mongoose.model('Head', headSchema);