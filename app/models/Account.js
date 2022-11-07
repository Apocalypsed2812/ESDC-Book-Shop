const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    username: { type: String, unique: true },
    password: { type: String },
    email: { type: String },
    role: { type: String },
    cart: { type: Array, default: []},
    name: { type: String },
    phone: { type: String },
    date: { type: String },
    sex: { type: String },
    image: { type: String },
    user_id: {type: Number},
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Account', Account);