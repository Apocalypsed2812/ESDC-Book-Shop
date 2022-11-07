const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Product = new Schema({
    name: { type: String},
    product_id: { type: Number, unique: true, default: 0},
    quantity: { type: Number },
    description: { type: String },
    image: { type: String },
    old_price: { type: String },
    new_price: { type: String },
    category: { type: String },
    category_id: { type: String },
    quantity_user: { type: Number , default: 0},
    slug: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Product', Product);