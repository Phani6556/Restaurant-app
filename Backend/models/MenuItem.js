const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: {
    type: String,
    enum: ['Drink', 'Burger', 'Pizza', 'French Fries', 'Veggies'],
    required: true
  },
  image: {
    type: String,
    default: ''   
  }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
