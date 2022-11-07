const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Staff = new Schema({
    staff_id: { type: Number, unique: true, default: 0},
    username: { type: String },
    email: { type: String },
    name: { type: String },
    identity: { type: String },
    phone: { type: String },
    sex: { type: String },
    date: { type: String },
    address: { type: String },
});

module.exports = mongoose.model('Staff', Staff);