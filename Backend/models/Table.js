const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, unique: true }, 
  name: String,
  chairs: Number,
  status: {
    type: String,
    enum: ['Reserved', 'Available'],
    default: 'Available',
  }
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);
