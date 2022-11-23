const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema({
    name: { type: String},
    phone: { type: String },
    address: { type: String },
    product: { type: Array, default: []},
    total: { type: String },
    status: { type: String },
    user_id: { type: String },
    date: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Order', Order);