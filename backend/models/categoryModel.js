const mongoose = require('mongoose');
const { optionSchema } = require('./Option');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  options: [optionSchema],
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;