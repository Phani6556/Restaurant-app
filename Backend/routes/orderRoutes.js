const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');
const Order = require('../models/Order');

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('tableId', 'tableNumber')
      .populate('chef')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
});

router.post('/:id', orderController.createOrder);
router.put('/:orderId/assign-chef', orderController.assignChef);
router.put('/:orderId/assign-table', orderController.assignTable);

router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order', details: err.message });
  }
});

module.exports = router;
