const mongoose = require('mongoose');
const { optionSchema } = require('./optionModel');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: String, required: true },
  category: { type: String, required: true }, // alternativ: mongoose.Schema.Types.ObjectId
  options: [optionSchema],
});

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;
