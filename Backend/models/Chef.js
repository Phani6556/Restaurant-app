const mongoose = require('mongoose');

const ChefSchema = new mongoose.Schema({
  name: String,
  ordersTaken: { type: Number, default: 0 }
});

module.exports = mongoose.model('Chef', ChefSchema);