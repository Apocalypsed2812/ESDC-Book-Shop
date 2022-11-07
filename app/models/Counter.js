const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Counter = new Schema({
    count: {type: Number, default: 0}
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Counter', Counter);