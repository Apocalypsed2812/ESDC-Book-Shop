const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Import = new Schema({
    id_staff: { type: String},
    total: { type: Number },
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

module.exports = mongoose.model('Import', Import);