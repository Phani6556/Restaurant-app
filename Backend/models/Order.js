const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  type: { type: String, enum: ['Dine In', 'Take Away'], required: true },
  status: { type: String, enum: ['Processing', 'Done', 'Served', 'Picked Up', 'Not Picked Up'], default: 'Processing' },
  doneAt: { type: Date },

  tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', default: null },
  tableNumber: { type: Number },

  items: [{ name: String, price: Number, quantity: Number }],
  total: Number,

  customer: { name: String, phone: String, address: String },
  chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef' },
  cookingInstructions: String,

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
