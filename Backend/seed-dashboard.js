const mongoose = require('mongoose');
require('dotenv').config();

const Chef = require('./models/Chef');
const Order = require('./models/Order');
const Table = require('./models/Table');
const MenuItem = require('./models/MenuItem');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to MongoDB');

  await mongoose.connection.db.collection('table').dropIndexes().catch(err => {
    if (err.codeName === 'NamespaceNotFound') {
      console.log('No existing indexes to drop.');
    } else {
      console.warn('Index drop warning:', err.message);
    }
  });
  await mongoose.connection.db.dropCollection('tables').catch(() => {});

  await Chef.deleteMany();
  await Order.deleteMany();
  await Table.deleteMany();
  await MenuItem.deleteMany();

  const chefs = await Chef.insertMany([
    { name: 'Phani' },
    { name: 'Sweety' },
    { name: 'Gopi' },
    { name: 'Nagi' },
    { name: 'Venkat' },
  ]);

 const tables = await Table.insertMany([
   { name: 'Table-01', chairs: 4, status: 'Available', tableNumber: 1 },
   { name: 'Table-02', chairs: 2, status: 'Reserved', tableNumber: 2 },
   { name: 'Table-03', chairs: 6, status: 'Available', tableNumber: 3 },
   { name: 'Table-04', chairs: 4, status: 'Available', tableNumber: 4 },
   { name: 'Table-05', chairs: 2, status: 'Reserved', tableNumber: 5 },
   { name: 'Table-06', chairs: 6, status: 'Available', tableNumber: 6 },
 ]);

  const menu = await MenuItem.insertMany([
   { name: 'Coke', price: 50, category: 'Drink',image: 'coke.jpg' },
    { name: 'Pepsi', price: 50, category: 'Drink' ,image: 'pepsi.jpg'},
    { name: 'Sprite', price: 50, category: 'Drink' ,image: 'sprite.jpg'},
    { name: 'Coffee', price: 80, category: 'Drink' ,image: 'coffee.jpg'},
    { name: 'Veg Burger', price: 100, category: 'Burger', image: 'veg.jpg' },
    { name: 'Chicken Burger', price: 150, category: 'Burger', image: 'chicken.jpg' },
    { name: 'Lamb Burger', price: 200, category: 'Burger', image: 'lamb.jpg' },
    { name: 'Double Patty Burger', price: 200, category: 'Burger', image: 'double.jpg' },
    { name: 'Pepperoni', price: 250, category: 'Pizza' ,image: 'pepperoni.jpg' },
    { name: 'Marinara', price: 150, category: 'Pizza' ,image: 'marinara.jpg'},
    { name: 'Capricciosa', price: 200, category: 'Pizza' ,image: 'capricciosa.jpg' },
    { name: 'Sicilian', price: 220, category: 'Pizza' ,image: 'sicilian.jpg' },
    { name: 'French Fries', price: 70, category: 'French Fries' ,image: 'french.jpg'},
     { name: 'Peri Peri French Fries', price: 90, category: 'French Fries' ,image: 'peri.jpg'},
    { name: 'Salad Bowl', price: 80, category: 'Veggies', image: 'salad.jpg' },
    { name: 'Tandoori Salad Bowl', price: 120, category: 'Veggies', image: 'tandoori.jpg' }
  ]);


  console.log('Dashboard seed complete.');
  process.exit();
});
