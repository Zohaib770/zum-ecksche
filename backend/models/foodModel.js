const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  options: [{
    name: { type: String },
    values: [{
      value: { type: String },
      priceAdjustment: { type: Number },
    }],
  }],
  isAvailable: { type: Boolean, default: true },
  order: { type: Number },
});

const Food = mongoose.model('Food', productSchema);
module.exports = Food;