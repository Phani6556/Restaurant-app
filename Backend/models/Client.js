const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: String,
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  address: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Client', clientSchema);
