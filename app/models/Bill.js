const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Bill = new Schema({
    id_staff: { type: String},
    id_customer: { type: String},
    total: { type: String },
    name_customer: { type: String },
    phone: { type: String },
    address: { type: String },
    status: { type: String },
    product: { type: Array, default: []},
    date: {type: String},
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Bill', Bill);