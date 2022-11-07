const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema({
    name: { type: String, unique: true },
    slug: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Category', Category);