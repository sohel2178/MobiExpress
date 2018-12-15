const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    customer_id: { type: String, required: true },
    type: { type: Number, default: 0 }
});

accountSchema.index({name: 1, customer_id: 1},{unique:true});

module.exports = mongoose.model('Account', accountSchema);

