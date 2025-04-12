const mongoose = require('mongoose');

const optionsSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Options = mongoose.model('Option', optionsSchema);
module.exports = Options;