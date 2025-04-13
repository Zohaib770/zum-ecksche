const mongoose = require('mongoose');

const optionValueSchema = new mongoose.Schema({
  value: { type: String, required: true },
  price: { type: String },
});

const optionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  values: [optionValueSchema],
});

const Options = mongoose.model('Option', optionsSchema);
module.exports = { Options };
