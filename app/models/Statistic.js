const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Statistic = new Schema({
    month: {type: String},
    year: {type: String},
    all_product: { type: Number },
    product_sold: { type: Number },
    product_remain: { type: Number },
});

module.exports = mongoose.model('Statistic', Statistic);