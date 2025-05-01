const mongoose = require('mongoose');

const extraSchema = new mongoose.Schema({
    category: { type: String },
    value: {
        name: { type: String },
        price: { type: Number }
    }
});

const Extra = mongoose.model('Extra', extraSchema);
module.exports = Extra;