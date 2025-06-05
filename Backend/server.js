// === server.js ===
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT'],
  },
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

const tableRoutes = require('./routes/tableRoutes');
const orderRoutes = require('./routes/orderRoutes');
const menuRoutes = require('./routes/menuRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/tables', tableRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/dashboard', dashboardRoutes);

const Order = require('./models/Order');
const Table = require('./models/Table');
const updateOrderStatuses = require('./Utils/statusUpdater');

setInterval(updateOrderStatuses, 60 * 1000);

io.on('connection', (socket) => {
  console.log('✅ Client connected:', socket.id);

  socket.on('newOrder', (order) => {
    console.log('📦 New order received:', order);
    io.emit('orderUpdate', order);
  });

  socket.on('requestTable', async () => {
    try {
      const table = await Table.findOneAndUpdate(
        { status: 'Available' },
        { status: 'Reserved' },
        { new: true }
      );

      if (table) {
        console.log(`🪑 Assigned Table ${table.tableNumber}`);
        socket.emit('tableAssigned', { tableNumber: table.tableNumber });
      } else {
        socket.emit('tableAssigned', { tableNumber: null });
      }
    } catch (err) {
      console.error('❌ Error assigning table:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('❎ Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB connection error:', err.message);
  });
