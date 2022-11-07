const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = new Schema({
    title: { type: String },
    content: { type: String },
    image: { type: String },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Notification', Notification);